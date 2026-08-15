interface CodeSolutions {
  [languageId: number]: string;
}

class CodeStorageDB {
  private dbName: string;

  private storeName: string;

  private version: number;

  private db: IDBDatabase | null;

  private getStorageKey(userId: string, problemId: string): string {
    return `${userId}:${problemId}`;
  }

  constructor() {
    this.dbName = 'CodeSolutionsDB';
    this.storeName = 'solutions';
    this.version = 1;
    this.db = null;
  }

  initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request: IDBOpenDBRequest = indexedDB.open(this.dbName, this.version);

      request.onerror = (event: Event) => {
        const { error } = event.target as IDBOpenDBRequest;
        reject(error?.message || 'Error opening database');
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async saveCode(problemId: string, languageId: number, code: string, userId: string): Promise<string> {
    if (!this.db) {
      await this.initDB();
    }
    const key = this.getStorageKey(userId, problemId);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const getRequest = store.get(key);

      getRequest.onsuccess = (event: Event) => {
        const solutions: CodeSolutions = (event.target as IDBRequest).result || {};
        solutions[languageId] = code;

        const putRequest = store.put(solutions, key);

        putRequest.onsuccess = () => resolve('Code saved successfully');
        putRequest.onerror = (event: Event) => {
          const { error } = event.target as IDBRequest;
          reject(error?.message || 'Error saving code');
        };
      };

      getRequest.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(error?.message || 'Error reading existing solutions');
      };
    });
  }

  async getCode(problemId: string, userId: string): Promise<Record<number, string>> {
    if (!this.db) {
      await this.initDB();
    }
    const key = this.getStorageKey(userId, problemId);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = (event: Event) => {
        const solutions: CodeSolutions = (event.target as IDBRequest).result || {};
        resolve(solutions);
      };

      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(error?.message || 'Error retrieving code');
      };
    });
  }

  async getAllSolutions(problemId: string): Promise<CodeSolutions> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(problemId);

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result || {});
      };

      request.onerror = (event: Event) => {
        const { error } = event.target as IDBRequest;
        reject(error?.message || 'Error retrieving solutions');
      };
    });
  }

  async deleteSolution(problemId: string, languageId: number, userId: string): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
    const key = this.getStorageKey(userId, problemId);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const getRequest = store.get(key);

      getRequest.onsuccess = (event: Event) => {
        const solutions: CodeSolutions = (event.target as IDBRequest).result || {};
        delete solutions[languageId];

        const putRequest =
          Object.keys(solutions).length === 0 ? store.delete(key) : store.put(solutions, key);

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = (event: Event) => {
          const { error } = event.target as IDBRequest;
          reject(error?.message || 'Error deleting solution');
        };
      };
    });
  }
}

const codeDB = new CodeStorageDB();

function useCodeStorage() {
  const saveUserCode = async (problemId: string, languageId: number, code: string, userId: string): Promise<void> => {
    try {
      await codeDB.saveCode(problemId, languageId, code, userId);
      console.log('Code saved successfully');
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const getUserCode = async (problemId: string, userId: string): Promise<Record<number, string>> => {
    try {
      return await codeDB.getCode(problemId, userId);
    } catch (error) {
      console.error('Error retrieving code:', error);
      return '';
    }
  };

  return {
    saveUserCode,
    getUserCode,
  };
}

export { CodeStorageDB, useCodeStorage };
export type { CodeSolutions };
