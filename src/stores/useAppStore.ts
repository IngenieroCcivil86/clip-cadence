import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import heroVideoStudio from '@/assets/hero-video-studio.jpg';
import techNewsAvatar from '@/assets/tech-news-avatar.jpg';

// Types for the application
export interface Channel {
  id: string;
  imagen1: string; // 16:9 image
  imagen2: string; // 1:1 image
  titulo: string;
  gmail: string;
  descripcion: string;
  categorias: string;
  api_key: string;
  idioma: string;
  fecha_creacion: string;
}

export interface Scene {
  id: number;
  status: 'idle' | 'pending' | 'success';
  scene_description: string;
  image_prompts: {
    start_prompt: string;
    end_prompt: string;
  };
  dialogues: Array<{
    speaker1?: {
      voice_type: string;
      text_speaker: string;
    };
    speaker2?: {
      voice_type: string;
      text_speaker: string;
    };
    speaker3?: {
      voice_type: string;
      text_speaker: string;
    };
  }>;
  video_sources: Array<{
    id: string;
    url: string;
    cuts: Array<{
      part: string;
      time_range: string;
    }>;
  }>;
  attachments: Array<{
    type: string;
    url: string;
    description: string;
  }>;
}

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  canal_id: string;
  created_at: string;
  scenes: Scene[];
}

interface AppState {
  // Authentication
  isAuthenticated: boolean;
  user: { email: string } | null;
  
  // Channels
  channels: Channel[];
  selectedChannel: Channel | null;
  
  // Video Projects
  videoProjects: VideoProject[];
  selectedProject: VideoProject | null;
  selectedScene: Scene | null;
  
  // UI State
  viewMode: 'grid' | 'list';
  searchQuery: string;
  selectedCategory: string;
  selectedLanguage: string;
  currentPage: number;
  
  // Actions
  login: () => boolean;
  logout: () => void;
  
  // Channel actions
  addChannel: (channel: Omit<Channel, 'id' | 'fecha_creacion'>) => void;
  updateChannel: (id: string, updates: Partial<Channel>) => void;
  deleteChannel: (id: string) => void;
  setSelectedChannel: (channel: Channel | null) => void;
  
  // Video project actions
  addVideoProject: (canalId: string, projectData: any) => void;
  updateVideoProject: (id: string, updates: Partial<VideoProject>) => void;
  deleteVideoProject: (id: string) => void;
  setSelectedProject: (project: VideoProject | null) => void;
  setSelectedScene: (scene: Scene | null) => void;
  
  // Scene actions
  updateScene: (projectId: string, sceneId: number, updates: Partial<Scene>) => void;
  addScene: (projectId: string, afterSceneId?: number) => void;
  deleteScene: (projectId: string, sceneId: number) => void;
  
  // UI actions
  setViewMode: (mode: 'grid' | 'list') => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedLanguage: (language: string) => void;
  setCurrentPage: (page: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      channels: [
        {
          id: 'canal_demo_001',
          imagen1: heroVideoStudio,
          imagen2: techNewsAvatar,
          titulo: 'Tech News Global',
          gmail: 'technews@example.com',
          descripcion: 'Las últimas noticias sobre tecnología, innovación y startups del mundo digital',
          categorias: 'Tecnología',
          api_key: 'demo_api_key_123',
          idioma: 'ES',
          fecha_creacion: new Date().toISOString()
        },
        {
          id: 'canal_demo_002',
          imagen1: heroVideoStudio,
          imagen2: techNewsAvatar,
          titulo: 'Gaming Zone',
          gmail: 'gaming@example.com',
          descripcion: 'Los mejores reviews y gameplays de videojuegos',
          categorias: 'Gaming',
          api_key: 'demo_api_key_456',
          idioma: 'ES',
          fecha_creacion: new Date().toISOString()
        },
        {
          id: 'canal_demo_003',
          imagen1: heroVideoStudio,
          imagen2: techNewsAvatar,
          titulo: 'Cooking Masters',
          gmail: 'cooking@example.com',
          descripcion: 'Recetas deliciosas y técnicas culinarias profesionales',
          categorias: 'Cocina',
          api_key: 'demo_api_key_789',
          idioma: 'ES',
          fecha_creacion: new Date().toISOString()
        }
      ],
      selectedChannel: null,
      videoProjects: [
        {
          id: 'project_demo_001',
          title: 'Video Tutorial: React Avanzado',
          description: 'Tutorial completo sobre React 19 y sus nuevas funcionalidades',
          canal_id: 'canal_demo_001',
          created_at: new Date().toISOString(),
          scenes: [
            {
              id: 1,
              status: 'success',
              scene_description: 'Introducción al curso de React 19',
              image_prompts: {
                start_prompt: 'Modern developer workspace with React logo',
                end_prompt: 'Code editor showing React 19 features'
              },
              dialogues: [{
                speaker1: {
                  voice_type: 'voz_masculina_profunda',
                  text_speaker: 'Bienvenidos a este tutorial completo sobre React 19, donde aprenderemos las nuevas funcionalidades y mejores prácticas.'
                }
              }],
              video_sources: [{
                id: 'clip1',
                url: 'https://drive.google.com/file/d/demo123/view',
                cuts: [{ part: 'intro', time_range: '00:00-00:30' }]
              }],
              attachments: []
            },
            {
              id: 2,
              status: 'pending',
              scene_description: 'Configuración del entorno de desarrollo',
              image_prompts: {
                start_prompt: 'Clean terminal showing npm install commands',
                end_prompt: 'VS Code with React project structure'
              },
              dialogues: [{
                speaker1: {
                  voice_type: 'voz_masculina_profunda',
                  text_speaker: 'Comenzamos configurando nuestro entorno de desarrollo con las últimas herramientas.'
                }
              }],
              video_sources: [],
              attachments: []
            },
            {
              id: 3,
              status: 'idle',
              scene_description: 'Primeros pasos con componentes',
              image_prompts: {
                start_prompt: 'Simple React component code',
                end_prompt: 'Rendered component in browser'
              },
              dialogues: [{
                speaker1: {
                  voice_type: 'voz_femenina_clara',
                  text_speaker: 'Ahora veremos cómo crear nuestros primeros componentes funcionales.'
                },
                speaker2: {
                  voice_type: 'voz_masculina_profunda',
                  text_speaker: 'Recuerden que los hooks son fundamentales en React moderno.'
                }
              }],
              video_sources: [],
              attachments: []
            }
          ]
        },
        {
          id: 'project_demo_002',
          title: 'Gameplay: Cyberpunk 2077',
          description: 'Explorando Night City en la nueva expansión',
          canal_id: 'canal_demo_002',
          created_at: new Date().toISOString(),
          scenes: [
            {
              id: 1,
              status: 'success',
              scene_description: 'Intro del gameplay',
              image_prompts: {
                start_prompt: 'Cyberpunk 2077 main menu',
                end_prompt: 'Character customization screen'
              },
              dialogues: [{
                speaker1: {
                  voice_type: 'voz_masculina_joven',
                  text_speaker: '¡Hola gamers! Hoy exploramos las nuevas zonas de Night City.'
                }
              }],
              video_sources: [],
              attachments: []
            }
          ]
        },
        {
          id: 'project_demo_003',
          title: 'Receta: Pasta Carbonara',
          description: 'La auténtica receta italiana paso a paso',
          canal_id: 'canal_demo_003',
          created_at: new Date().toISOString(),
          scenes: [
            {
              id: 1,
              status: 'idle',
              scene_description: 'Presentación de ingredientes',
              image_prompts: {
                start_prompt: 'Fresh pasta ingredients on wooden table',
                end_prompt: 'All ingredients neatly arranged'
              },
              dialogues: [{
                speaker1: {
                  voice_type: 'voz_femenina_clara',
                  text_speaker: 'Bienvenidos a Cooking Masters, hoy preparemos una auténtica carbonara.'
                }
              }],
              video_sources: [],
              attachments: []
            },
            {
              id: 2,
              status: 'pending',
              scene_description: 'Proceso de cocción',
              image_prompts: {
                start_prompt: 'Boiling water with pasta',
                end_prompt: 'Perfect al dente pasta'
              },
              dialogues: [{
                speaker1: {
                  voice_type: 'voz_femenina_clara',
                  text_speaker: 'El secreto está en el timing perfecto de la cocción.'
                }
              }],
              video_sources: [],
              attachments: []
            }
          ]
        }
      ],
      selectedProject: null,
      selectedScene: null,
      viewMode: 'grid',
      searchQuery: '',
      selectedCategory: '',
      selectedLanguage: '',
      currentPage: 1,

      // Authentication actions - simplified for UI only
      login: () => {
        set({ 
          isAuthenticated: true, 
          user: { email: 'demo@google.com' } 
        });
        return true;
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null, 
          selectedChannel: null,
          selectedProject: null,
          selectedScene: null 
        });
      },

      // Channel actions
      addChannel: (channelData) => {
        const newChannel: Channel = {
          ...channelData,
          id: `canal_${Date.now()}`,
          fecha_creacion: new Date().toISOString(),
        };
        set((state) => ({
          channels: [...state.channels, newChannel],
        }));
      },

      updateChannel: (id, updates) => {
        set((state) => ({
          channels: state.channels.map((channel) =>
            channel.id === id ? { ...channel, ...updates } : channel
          ),
        }));
      },

      deleteChannel: (id) => {
        set((state) => ({
          channels: state.channels.filter((channel) => channel.id !== id),
          videoProjects: state.videoProjects.filter((project) => project.canal_id !== id),
          selectedChannel: state.selectedChannel?.id === id ? null : state.selectedChannel,
        }));
      },

      setSelectedChannel: (channel) => {
        set({ selectedChannel: channel });
      },

      // Video project actions
      addVideoProject: (canalId, projectData) => {
        const newProject: VideoProject = {
          id: `project_${Date.now()}`,
          title: projectData.title || 'Nuevo Proyecto',
          description: projectData.description || '',
          canal_id: canalId,
          created_at: new Date().toISOString(),
          scenes: projectData.scenes || [],
        };
        set((state) => ({
          videoProjects: [...state.videoProjects, newProject],
        }));
      },

      updateVideoProject: (id, updates) => {
        set((state) => ({
          videoProjects: state.videoProjects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        }));
      },

      deleteVideoProject: (id) => {
        set((state) => ({
          videoProjects: state.videoProjects.filter((project) => project.id !== id),
          selectedChannel: state.selectedChannel?.id === id ? null : state.selectedChannel,
        }));
      },

      setSelectedProject: (project) => {
        set({ selectedProject: project });
      },

      setSelectedScene: (scene) => {
        set({ selectedScene: scene });
      },

      // Scene actions
      updateScene: (projectId, sceneId, updates) => {
        set((state) => ({
          videoProjects: state.videoProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  scenes: project.scenes.map((scene) =>
                    scene.id === sceneId ? { ...scene, ...updates } : scene
                  ),
                }
              : project
          ),
        }));
      },

      addScene: (projectId, afterSceneId) => {
        const newScene: Scene = {
          id: Date.now(),
          status: 'idle',
          scene_description: '',
          image_prompts: { start_prompt: '', end_prompt: '' },
          dialogues: [],
          video_sources: [],
          attachments: [],
        };

        set((state) => ({
          videoProjects: state.videoProjects.map((project) => {
            if (project.id === projectId) {
              const scenes = [...project.scenes];
              if (afterSceneId !== undefined) {
                const insertIndex = scenes.findIndex((s) => s.id === afterSceneId) + 1;
                scenes.splice(insertIndex, 0, newScene);
              } else {
                scenes.push(newScene);
              }
              return { ...project, scenes };
            }
            return project;
          }),
        }));
      },

      deleteScene: (projectId, sceneId) => {
        set((state) => ({
          videoProjects: state.videoProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  scenes: project.scenes.filter((scene) => scene.id !== sceneId),
                }
              : project
          ),
        }));
      },

      // UI actions
      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
      setSelectedLanguage: (language) => set({ selectedLanguage: language, currentPage: 1 }),
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'clip-cadence-storage',
      partialize: (state) => ({
        channels: state.channels,
        videoProjects: state.videoProjects,
        viewMode: state.viewMode,
      }),
    }
  )
);