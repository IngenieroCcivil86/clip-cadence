import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  Check, 
  Edit3,
  Play,
  Image,
  Bird
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EditProject = () => {
  const { id: channelId, videoId } = useParams<{ id: string; videoId: string }>();
  const navigate = useNavigate();
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { videoProjects, updateVideoProject } = useAppStore();

  const project = videoProjects.find(p => p.id === videoId);
  const scenes = project?.scenes || [];

  const handleBack = () => {
    navigate(`/canal/${channelId}`);
  };

  const handleAddScene = () => {
    if (selectedSceneIndex === null) {
      toast({
        title: "Selecciona una escena",
        description: "Debes seleccionar una escena para agregar una nueva debajo de ella",
        variant: "destructive"
      });
      return;
    }

    const newScene = {
      id: scenes.length + 1,
      status: 'idle' as const,
      scene_description: 'Nueva escena',
      image_prompts: {
        start_prompt: '',
        end_prompt: ''
      },
      dialogues: [],
      video_sources: [],
      attachments: []
    };

    const updatedScenes = [...scenes];
    updatedScenes.splice(selectedSceneIndex + 1, 0, newScene);

    if (project) {
      updateVideoProject(project.id, {
        ...project,
        scenes: updatedScenes
      });
    }

    toast({
      title: "Escena agregada",
      description: "Nueva escena agregada exitosamente"
    });
  };

  const handleDeleteScene = () => {
    if (selectedSceneIndex === null) {
      toast({
        title: "Selecciona una escena",
        description: "Debes seleccionar una escena para eliminarla",
        variant: "destructive"
      });
      return;
    }

    const updatedScenes = scenes.filter((_, index) => index !== selectedSceneIndex);
    
    if (project) {
      updateVideoProject(project.id, {
        ...project,
        scenes: updatedScenes
      });
    }

    setSelectedSceneIndex(null);
    toast({
      title: "Escena eliminada",
      description: "Escena eliminada exitosamente"
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Cambios guardados",
      description: "Todos los cambios han sido guardados en la base de datos"
    });
  };

  const handleEditScene = () => {
    if (selectedSceneIndex === null) {
      toast({
        title: "Selecciona una escena",
        description: "Debes seleccionar una escena para editarla",
        variant: "destructive"
      });
      return;
    }

    const sceneId = scenes[selectedSceneIndex]?.id;
    navigate(`/canal/${channelId}/create/${videoId}/${sceneId}`);
  };

  const handleStatusChange = (sceneIndex: number, newStatus: 'idle' | 'pending' | 'success') => {
    const updatedScenes = scenes.map((scene, index) => 
      index === sceneIndex ? { ...scene, status: newStatus } : scene
    );

    if (project) {
      updateVideoProject(project.id, {
        ...project,
        scenes: updatedScenes
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'text-status-idle';
      case 'pending': return 'text-status-pending';
      case 'success': return 'text-status-success';
      default: return 'text-muted-foreground';
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={handleBack} />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
            <Button onClick={handleBack}>Volver al canal</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={handleBack} />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground">Editando proyecto de video</p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            Vista {viewMode === 'grid' ? 'Lista' : 'Grid'}
          </Button>
        </div>

        <div className="space-y-4">
          {scenes.map((scene, index) => (
            <Card 
              key={scene.id}
              className={`cursor-pointer transition-all ${
                selectedSceneIndex === index 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedSceneIndex(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="text-sm font-mono text-muted-foreground mb-2">
                      ID: {scene.id} • 0:{String(index * 20 + 20).padStart(2, '0')}
                    </div>
                    
                    <div className="relative">
                      <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        {scene.image_prompts?.start_prompt || scene.image_prompts?.end_prompt ? (
                          <div className="flex space-x-1">
                            <div className="w-20 h-28 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center">
                              <Image className="h-8 w-8 text-primary" />
                            </div>
                            <div className="w-20 h-28 bg-gradient-to-br from-accent/20 to-primary/20 rounded flex items-center justify-center">
                              <Image className="h-8 w-8 text-accent" />
                            </div>
                          </div>
                        ) : scene.video_sources?.length > 0 ? (
                          <Play className="h-12 w-12 text-muted-foreground" />
                        ) : (
                          <Bird className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <div className={`w-3 h-3 rounded-full ${
                          scene.status === 'success' ? 'bg-status-success' :
                          scene.status === 'pending' ? 'bg-status-pending' :
                          'bg-status-idle'
                        }`} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {scene.scene_description || 'Sin descripción'}
                      </h3>
                      
                      {scene.dialogues?.map((dialogue, dialogueIndex) => (
                        <div key={dialogueIndex} className="space-y-2 text-sm">
                          {dialogue.speaker1 && (
                            <div className="bg-muted/50 p-2 rounded">
                              <strong>Locutor 1:</strong> {dialogue.speaker1.text_speaker || 'Sin diálogo'}
                            </div>
                          )}
                          {dialogue.speaker2 && (
                            <div className="bg-muted/50 p-2 rounded">
                              <strong>Locutor 2:</strong> {dialogue.speaker2.text_speaker || 'Sin diálogo'}
                            </div>
                          )}
                          {dialogue.speaker3 && (
                            <div className="bg-muted/50 p-2 rounded">
                              <strong>Locutor 3:</strong> {dialogue.speaker3.text_speaker || 'Sin diálogo'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Estado:</span>
                        <div className="flex space-x-2">
                          {(['idle', 'pending', 'success'] as const).map((status) => (
                            <label key={status} className="flex items-center space-x-1 cursor-pointer">
                              <Checkbox
                                checked={scene.status === status}
                                onCheckedChange={() => handleStatusChange(index, status)}
                                className={getStatusColor(status)}
                              />
                              <span className={`text-xs ${getStatusColor(status)}`}>
                                {status === 'idle' ? 'Inactivo' : 
                                 status === 'pending' ? 'Pendiente' : 'Completado'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Fixed bottom toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-card border rounded-full px-6 py-3 shadow-lg flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddScene}
            className="rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteScene}
            className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveChanges}
            className="rounded-full text-success hover:text-success hover:bg-success/10"
          >
            <Check className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditScene}
            className="rounded-full"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProject;