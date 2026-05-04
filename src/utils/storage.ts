import { Item, Project, Fornecedor, Packaging } from '../types';

const KEYS = {
  ITEMS: 'packsys_items',
  PROJECTS: 'packsys_projects',
  ACTIVE_PROJECT: 'packsys_active_project',
  FORNECEDORES: 'packsys_fornecedores',
  PACKAGINGS: 'packsys_packagings',
} as const;

function get<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function set<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Items
export function getItems(): Item[] {
  return get<Item>(KEYS.ITEMS);
}

export function saveItems(items: Item[]): void {
  set(KEYS.ITEMS, items);
}

export function addItem(item: Item): Item[] {
  const items = getItems();
  items.push(item);
  saveItems(items);
  return items;
}

export function updateItem(updated: Item): Item[] {
  const items = getItems().map((i) => (i.id === updated.id ? updated : i));
  saveItems(items);
  return items;
}

export function deleteItem(id: string): Item[] {
  const items = getItems().filter((i) => i.id !== id);
  saveItems(items);
  return items;
}

export function clearItems(): void {
  saveItems([]);
}

// Projects
export function getProjects(): Project[] {
  return get<Project>(KEYS.PROJECTS);
}

export function saveProjects(projects: Project[]): void {
  set(KEYS.PROJECTS, projects);
}

export function addProject(project: Project): Project[] {
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
  return projects;
}

export function updateProject(updated: Project): Project[] {
  const projects = getProjects().map((p) => (p.id === updated.id ? updated : p));
  saveProjects(projects);
  return projects;
}

export function deleteProject(id: string): Project[] {
  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);
  return projects;
}

// Active Project
export function getActiveProjectId(): string | null {
  return localStorage.getItem(KEYS.ACTIVE_PROJECT);
}

export function setActiveProjectId(id: string | null): void {
  if (id) {
    localStorage.setItem(KEYS.ACTIVE_PROJECT, id);
  } else {
    localStorage.removeItem(KEYS.ACTIVE_PROJECT);
  }
}

// Fornecedores
export function getFornecedores(): Fornecedor[] {
  return get<Fornecedor>(KEYS.FORNECEDORES);
}

export function saveFornecedores(fornecedores: Fornecedor[]): void {
  set(KEYS.FORNECEDORES, fornecedores);
}

export function addFornecedor(f: Fornecedor): Fornecedor[] {
  const list = getFornecedores();
  list.push(f);
  saveFornecedores(list);
  return list;
}

export function updateFornecedor(updated: Fornecedor): Fornecedor[] {
  const list = getFornecedores().map((f) => (f.id === updated.id ? updated : f));
  saveFornecedores(list);
  return list;
}

export function deleteFornecedor(id: string): Fornecedor[] {
  const list = getFornecedores().filter((f) => f.id !== id);
  saveFornecedores(list);
  return list;
}

// Packagings
export function getPackagings(): Packaging[] {
  return get<Packaging>(KEYS.PACKAGINGS);
}

export function savePackagings(packagings: Packaging[]): void {
  set(KEYS.PACKAGINGS, packagings);
}

export function addPackaging(p: Packaging): Packaging[] {
  const list = getPackagings();
  list.push(p);
  savePackagings(list);
  return list;
}

export function updatePackaging(updated: Packaging): Packaging[] {
  const list = getPackagings().map((p) => (p.id === updated.id ? updated : p));
  savePackagings(list);
  return list;
}

export function deletePackaging(id: string): Packaging[] {
  const list = getPackagings().filter((p) => p.id !== id);
  savePackagings(list);
  return list;
}
