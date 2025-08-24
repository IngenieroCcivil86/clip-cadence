import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Plus, 
  Calendar, 
  Edit3, 
  Clock, 
  CheckCircle, 
  Trash2,
  Play,
  Timer
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CreateProjectModal from '@/components/canal/CreateProjectModal';

const Canal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { 
    channels, 
    videoProjects, 
    selectedChannel,
    setSelectedChannel,
    deleteVideoProject 
  } = useAppStore();

  // Find the current channel
  const channel = channels.find(c => c.id === id);
  
  // Get projects for this channel
  const channelProjects = videoProjects.filter(p => p.canal_id === id);

  useEffect(() => {
    if (channel) {
      setSelectedChannel(channel);
    }
  }, [channel, setSelectedChannel]);

  const handleBack = () => {
    navigate('/');
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      deleteVideoProject(projectId);
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto ha sido eliminado exitosamente",
      });
    }
  };

  const getProjectStatus = (project: any) => {
    if (!project.scenes || project.scenes.length === 0) {
      return 'pending';
    }
    
    const allSuccess = project.scenes.every((scene: any) => scene.status === 'success');
    if (allSuccess) return 'success';
    
    const anyPending = project.scenes.some((scene: any) => scene.status === 'pending');
    if (anyPending) return 'pending';
    
    return 'idle';
  };

  const handleProjectAction = (project: any) => {
    const status = getProjectStatus(project);
    if (status === 'success') {
      // Navigate to video page
      navigate(`/video/${project.id}`);
    } else {
      // Navigate to edit page
      navigate(`/canal/${id}/edit/${project.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!channel) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={handleBack} />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Canal no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              El canal que estás buscando no existe o ha sido eliminado.
            </p>
            <Button onClick={handleBack}>
              Volver al inicio
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={handleBack} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero section */}
        <div className="relative">
          {/* Banner image */}
          <AspectRatio ratio={16 / 4} className="rounded-xl overflow-hidden">
            {channel.imagen1 ? (
              <img
                src={channel.imagen1}
                alt={`${channel.titulo} banner`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 flex items-center justify-center">
                <Play className="h-12 w-12 text-primary" />
              </div>
            )}
          </AspectRatio>

          {/* Channel avatar */}
          <div className="absolute -bottom-8 left-6">
            <div className="w-20 h-20 rounded-full border-4 border-background bg-card overflow-hidden shadow-lg">
              {channel.imagen2 ? (
                <img
                  src={channel.imagen2}
                  alt={`${channel.titulo} avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Play className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Channel info */}
        <div className="pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{channel.titulo}</h1>
              <p className="text-muted-foreground max-w-2xl">
                {channel.descripcion}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{channel.categorias}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Creado el {formatDate(channel.fecha_creacion)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Proyectos de Video ({channelProjects.length})
            </h2>
          </div>

          {/* Projects list */}
          {channelProjects.length > 0 ? (
            <div className="space-y-3">
              {channelProjects.map((project) => {
                const status = getProjectStatus(project);
                return (
                  <Card 
                    key={project.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProjectAction(project)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(project.created_at)}
                          </p>
                          {project.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3 ml-4">
                          {/* Status icon */}
                          <div className="flex items-center">
                            {status === 'success' ? (
                              <CheckCircle className="h-5 w-5 text-status-success" />
                            ) : status === 'pending' ? (
                              <Clock className="h-5 w-5 text-status-pending animate-pulse" />
                            ) : (
                              <Timer className="h-5 w-5 text-status-idle" />
                            )}
                          </div>

                          {/* Action buttons */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Edit channel functionality would go here
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <div className="text-lg font-medium mb-2">
                  No hay proyectos de video aún
                </div>
                <div>
                  Crea tu primer proyecto para comenzar a trabajar con escenas.
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating add button */}
      <Button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-40"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Create project modal */}
      <CreateProjectModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        channelId={id || ''}
      />
    </div>
  );
};

export default Canal;