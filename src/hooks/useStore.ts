import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  User,
  Requirement,
  Application,
  RequirementFormData,
  ApplicationFormData,
  UserRegisterData,
  ApplicationStatus
} from '@/types';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Safe localStorage access
const safeStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

// Date serialization helpers
const serializeData = <T>(data: T): string => {
  return JSON.stringify(data, (_key, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', iso: value.toISOString() };
    }
    return value;
  });
};

const deserializeData = <T>(json: string): T => {
  return JSON.parse(json, (_key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.iso);
    }
    return value;
  });
};

// Phone validation (Chinese mobile: 11 digits starting with 1)
const isValidPhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone);
};

// LocalStorage keys
const KEYS = {
  USERS: 'ideagogogo_users',
  REQUIREMENTS: 'ideagogogo_requirements',
  APPLICATIONS: 'ideagogogo_applications',
  CURRENT_USER: 'ideagogogo_current_user',
};

// Mock data
const mockRequirements: Requirement[] = [
  {
    id: '1',
    title: '企业内部CRM系统开发',
    description: '需要开发一套内部使用的客户关系管理系统，包含客户管理、订单跟踪、数据分析等模块。技术栈要求：React + Node.js + PostgreSQL。',
    type: 'enterprise',
    status: 'open',
    authorId: 'admin',
    authorName: 'IDEAGOGOGO官方',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['React', 'Node.js', 'PostgreSQL', 'CRM'],
    budget: 50000,
  },
  {
    id: '2',
    title: 'AI智能客服机器人',
    description: '基于大语言模型的智能客服系统，需要支持多轮对话、知识库检索、情感分析等功能。',
    type: 'enterprise',
    status: 'open',
    authorId: 'admin',
    authorName: 'IDEAGOGOGO官方',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['AI', 'LLM', 'Python', 'NLP'],
    budget: 80000,
  },
  {
    id: '3',
    title: '区块链供应链溯源平台',
    description: '一个创新的区块链项目，旨在构建透明、可信的供应链溯源系统。寻找技术合伙人共同创业。',
    type: 'innovation',
    status: 'open',
    authorId: 'admin',
    authorName: 'IDEAGOGOGO官方',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['区块链', 'Web3', '创业', '供应链'],
  },
  {
    id: '4',
    title: '移动端社交电商App',
    description: '结合短视频和社交的电商平台，需要iOS和Android双端开发，寻找有经验的移动开发团队。',
    type: 'enterprise',
    status: 'open',
    authorId: 'admin',
    authorName: 'IDEAGOGOGO官方',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['React Native', 'iOS', 'Android', '电商'],
    budget: 120000,
  },
  {
    id: '5',
    title: '元宇宙虚拟展厅',
    description: '基于WebGL的3D虚拟展厅，支持VR设备访问。寻找对元宇宙有热情的3D开发者和设计师合伙。',
    type: 'innovation',
    status: 'open',
    authorId: 'admin',
    authorName: 'IDEAGOGOGO官方',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['WebGL', 'Three.js', 'VR', '元宇宙'],
  },
];

// User Store
export const useUserStore = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = safeStorage.get(KEYS.CURRENT_USER);
    if (stored) {
      try {
        setCurrentUser(deserializeData<User>(stored));
      } catch {
        // ignore parse error
      }
    }
    setIsLoaded(true);
  }, []);

  const register = useCallback((data: UserRegisterData): User | null => {
    // Validate phone format
    if (!isValidPhone(data.phone)) {
      return null;
    }

    const usersRaw = safeStorage.get(KEYS.USERS);
    const users: User[] = usersRaw ? deserializeData<User[]>(usersRaw) : [];

    // Check if phone already exists
    if (users.some(u => u.phone === data.phone)) {
      return null;
    }

    const newUser: User = {
      id: generateId(),
      name: data.name,
      phone: data.phone,
      role: data.role || 'developer',
      createdAt: new Date(),
    };
    users.push(newUser);
    safeStorage.set(KEYS.USERS, serializeData(users));
    safeStorage.set(KEYS.CURRENT_USER, serializeData(newUser));
    setCurrentUser(newUser);
    return newUser;
  }, []);

  const login = useCallback((phone: string): User | null => {
    // Validate phone format
    if (!isValidPhone(phone)) {
      return null;
    }

    const usersRaw = safeStorage.get(KEYS.USERS);
    const users: User[] = usersRaw ? deserializeData<User[]>(usersRaw) : [];
    const user = users.find(u => u.phone === phone);
    if (user) {
      safeStorage.set(KEYS.CURRENT_USER, serializeData(user));
      setCurrentUser(user);
      return user;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    safeStorage.remove(KEYS.CURRENT_USER);
    setCurrentUser(null);
  }, []);

  return { currentUser, isLoaded, register, login, logout, isValidPhone };
};

// Requirement Store
export const useRequirementStore = () => {
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const requirementsRef = useRef(requirements);

  // Keep ref in sync
  useEffect(() => {
    requirementsRef.current = requirements;
  }, [requirements]);

  useEffect(() => {
    const stored = safeStorage.get(KEYS.REQUIREMENTS);
    if (stored) {
      try {
        setRequirements(deserializeData<Requirement[]>(stored));
      } catch {
        // use default mock data
      }
    } else {
      safeStorage.set(KEYS.REQUIREMENTS, serializeData(mockRequirements));
    }
  }, []);

  const create = useCallback((data: RequirementFormData, author: User): Requirement => {
    const newRequirement: Requirement = {
      id: generateId(),
      title: data.title,
      description: data.description,
      type: data.type,
      status: 'open',
      authorId: author.id,
      authorName: author.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: data.tags,
      budget: data.budget,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    };
    // Use ref to avoid stale closure
    const updated = [newRequirement, ...requirementsRef.current];
    safeStorage.set(KEYS.REQUIREMENTS, serializeData(updated));
    setRequirements(updated);
    return newRequirement;
  }, []);

  const getById = useCallback((id: string): Requirement | undefined => {
    return requirementsRef.current.find(r => r.id === id);
  }, []);

  return { requirements, create, getById };
};

// Application Store
export const useApplicationStore = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const applicationsRef = useRef(applications);

  // Keep ref in sync
  useEffect(() => {
    applicationsRef.current = applications;
  }, [applications]);

  useEffect(() => {
    const stored = safeStorage.get(KEYS.APPLICATIONS);
    if (stored) {
      try {
        setApplications(deserializeData<Application[]>(stored));
      } catch {
        // ignore parse error
      }
    }
  }, []);

  const create = useCallback((data: ApplicationFormData, requirement: Requirement, developer: User): Application | null => {
    // Check for duplicate application
    const existing = applicationsRef.current.find(
      a => a.requirementId === requirement.id && a.developerId === developer.id
    );
    if (existing) {
      return null; // Already applied
    }

    const newApplication: Application = {
      id: generateId(),
      requirementId: requirement.id,
      requirementTitle: requirement.title,
      developerId: developer.id,
      developerName: developer.name,
      developerPhone: developer.phone,
      status: 'pending',
      type: data.type,
      price: data.price,
      duration: data.duration,
      questions: data.questions,
      message: data.message,
      createdAt: new Date(),
    };
    // Use ref to avoid stale closure
    const updated = [newApplication, ...applicationsRef.current];
    safeStorage.set(KEYS.APPLICATIONS, serializeData(updated));
    setApplications(updated);
    return newApplication;
  }, []);

  const updateStatus = useCallback((id: string, status: ApplicationStatus) => {
    const updated = applicationsRef.current.map(a =>
      a.id === id ? { ...a, status } : a
    );
    safeStorage.set(KEYS.APPLICATIONS, serializeData(updated));
    setApplications(updated);
  }, []);

  const hasApplied = useCallback((requirementId: string, developerId: string): boolean => {
    return applicationsRef.current.some(
      a => a.requirementId === requirementId && a.developerId === developerId
    );
  }, []);

  return { applications, create, updateStatus, hasApplied };
};
