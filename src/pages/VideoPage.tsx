import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Play, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const VideoPage = () => {
  const { id: videoId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { videoProjects, channels } = useAppStore();

  const project = videoProjects.find(p => p.id === videoId);
  const channel = project ? channels.find(c => c.id === project.canal_id) : null;

  const handleBack = () => {
    if (project) {
      navigate(`/canal/${project.canal_id}`);
    } else {
      navigate('/');
    }
  };

  const generateVideoUrl = () => {
    // Generate a mock URL for the video
    return `https://clipcadence.app/watch/${videoId}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado al portapapeles",
        description: "La URL ha sido copiada exitosamente"
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "No se pudo copiar la URL",
        variant: "destructive"
      });
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={handleBack} />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Video no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              El video que estás buscando no existe o ha sido eliminado.
            </p>
            <Button onClick={handleBack}>
              Volver al inicio
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const videoUrl = generateVideoUrl();
  const allScenesCompleted = project.scenes?.every(scene => scene.status === 'success') ?? false;

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton onBack={handleBack} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Play className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{project.title}</h1>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <span>ID:</span>
            <code className="bg-muted px-2 py-1 rounded text-sm">{project.id}</code>
          </div>

          {channel && (
            <div className="text-muted-foreground">
              Canal: <span className="font-medium">{channel.titulo}</span>
            </div>
          )}
        </div>

        {/* Video Status */}
        <div className="text-center">
          {allScenesCompleted ? (
            <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="font-medium">Video completado y listo</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 bg-status-pending/10 text-status-pending px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-status-pending rounded-full animate-pulse" />
              <span className="font-medium">Video en proceso</span>
            </div>
          )}
        </div>

        {/* Video URL Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5" />
              <span>URL del Video</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>URL generada del video</Label>
              <div className="flex space-x-2">
                <Input
                  value={videoUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(videoUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Esta URL se puede compartir una vez que el video esté completado
              </p>
            </div>

            {allScenesCompleted && (
              <Button className="w-full" asChild>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <Play className="h-4 w-4 mr-2" />
                  Ver video completo
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Detalles del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Descripción</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description || 'Sin descripción'}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Fecha de creación</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(project.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Total de escenas</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.scenes?.length || 0} escenas
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Escenas completadas</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.scenes?.filter(scene => scene.status === 'success').length || 0} de {project.scenes?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Progreso del proyecto</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(((project.scenes?.filter(scene => scene.status === 'success').length || 0) / (project.scenes?.length || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{
                    width: `${((project.scenes?.filter(scene => scene.status === 'success').length || 0) / (project.scenes?.length || 1)) * 100}%`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline"
            onClick={() => navigate(`/canal/${project.canal_id}/edit/${project.id}`)}
          >
            Editar proyecto
          </Button>
          
          <Button onClick={handleBack}>
            Volver al canal
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VideoPage;