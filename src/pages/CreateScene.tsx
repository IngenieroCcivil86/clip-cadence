import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Check, 
  RotateCcw,
  Play
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CreateScene = () => {
  const { id: channelId, videoId, sceneId } = useParams<{ 
    id: string; 
    videoId: string; 
    sceneId: string; 
  }>();
  const navigate = useNavigate();

  const { videoProjects, updateVideoProject } = useAppStore();
  
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [startPrompt, setStartPrompt] = useState('');
  const [endPrompt, setEndPrompt] = useState('');
  const [speaker1, setSpeaker1] = useState('');
  const [speaker2, setSpeaker2] = useState('');
  const [speaker3, setSpeaker3] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [persistVideos, setPersistVideos] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [persistImages, setPersistImages] = useState(false);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [cutStartTime, setCutStartTime] = useState('');
  const [cutEndTime, setCutEndTime] = useState('');

  const project = videoProjects.find(p => p.id === videoId);
  const scene = project?.scenes?.find(s => s.id === parseInt(sceneId || '0'));

  useEffect(() => {
    if (scene) {
      setSceneDescription(scene.scene_description || '');
      setStartPrompt(scene.image_prompts?.start_prompt || '');
      setEndPrompt(scene.image_prompts?.end_prompt || '');
      
      const dialogue = scene.dialogues?.[0];
      if (dialogue) {
        setSpeaker1(dialogue.speaker1?.text_speaker || '');
        setSpeaker2(dialogue.speaker2?.text_speaker || '');
        setSpeaker3(dialogue.speaker3?.text_speaker || '');
      }

      const videoSources = scene.video_sources?.map(vs => vs.url) || [];
      setVideoUrls(videoSources);
      if (videoSources.length > 0) {
        setSelectedVideoUrl(videoSources[0]);
      }

      const attachmentUrls = scene.attachments?.filter(a => a.type === 'image').map(a => a.url) || [];
      setImageUrls(attachmentUrls);
    }
  }, [scene]);

  const handleBack = () => {
    navigate(`/canal/${channelId}/edit/${videoId}`);
  };

  const addVideoUrl = () => {
    if (newVideoUrl.trim()) {
      const updatedUrls = [...videoUrls, newVideoUrl.trim()];
      setVideoUrls(updatedUrls);
      setNewVideoUrl('');
      
      if (!selectedVideoUrl) {
        setSelectedVideoUrl(updatedUrls[0]);
      }
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleSave = () => {
    if (!project || !scene) return;

    const updatedScene = {
      ...scene,
      scene_description: sceneDescription,
      image_prompts: {
        start_prompt: startPrompt,
        end_prompt: endPrompt
      },
      dialogues: [{
        speaker1: speaker1 ? { voice_type: 'voz_masculina_profunda', text_speaker: speaker1 } : undefined,
        speaker2: speaker2 ? { voice_type: 'voz_masculina_profunda', text_speaker: speaker2 } : undefined,
        speaker3: speaker3 ? { voice_type: 'voz_masculina_profunda', text_speaker: speaker3 } : undefined
      }],
      video_sources: videoUrls.map((url, index) => ({
        id: `clip${index + 1}`,
        url,
        cuts: cutStartTime && cutEndTime ? [{
          part: 'part1',
          time_range: `${cutStartTime}-${cutEndTime}`
        }] : []
      })),
      attachments: imageUrls.map((url, index) => ({
        type: 'image',
        url,
        description: `Imagen ${index + 1}`
      }))
    };

    const updatedScenes = project.scenes.map(s => 
      s.id === scene.id ? updatedScene : s
    );

    updateVideoProject(project.id, {
      ...project,
      scenes: updatedScenes
    });

    toast({
      title: "Escena guardada",
      description: "Los cambios han sido guardados exitosamente"
    });

    navigate(`/canal/${channelId}/edit/${videoId}`);
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres resetear todos los cambios?')) {
      // Reset to original values
      if (scene) {
        setSceneDescription(scene.scene_description || '');
        setStartPrompt(scene.image_prompts?.start_prompt || '');
        setEndPrompt(scene.image_prompts?.end_prompt || '');
        
        const dialogue = scene.dialogues?.[0];
        if (dialogue) {
          setSpeaker1(dialogue.speaker1?.text_speaker || '');
          setSpeaker2(dialogue.speaker2?.text_speaker || '');
          setSpeaker3(dialogue.speaker3?.text_speaker || '');
        }
      }
      
      setNewVideoUrl('');
      setNewImageUrl('');
      setCutStartTime('');
      setCutEndTime('');
    }
  };

  if (!project || !scene) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Escena no encontrada</h1>
            <Button onClick={handleBack}>Volver a edición</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Video Player - 70% */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label>Selector de Video</Label>
              <Select value={selectedVideoUrl} onValueChange={setSelectedVideoUrl}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un video" />
                </SelectTrigger>
                <SelectContent>
                  {videoUrls.map((url, index) => (
                    <SelectItem key={index} value={url}>
                      Video {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Video Player Container */}
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              {selectedVideoUrl ? (
                <iframe
                  src={selectedVideoUrl.replace('/view?usp=sharing', '/preview')}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-white flex flex-col items-center space-y-4">
                  <Play className="h-16 w-16" />
                  <p>Selecciona un video para reproducir</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel - 30% */}
          <div className="space-y-4">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-6 pr-4">
                {/* Scene Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información de Escena</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>ID de Escena</Label>
                      <Input value={scene.id} disabled />
                    </div>
                    
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        value={sceneDescription}
                        onChange={(e) => setSceneDescription(e.target.value)}
                        placeholder="Descripción de la escena"
                      />
                    </div>

                    <div>
                      <Label>Prompt Inicial</Label>
                      <Textarea
                        value={startPrompt}
                        onChange={(e) => setStartPrompt(e.target.value)}
                        placeholder="Prompt para imagen inicial"
                      />
                    </div>

                    <div>
                      <Label>Prompt Final</Label>
                      <Textarea
                        value={endPrompt}
                        onChange={(e) => setEndPrompt(e.target.value)}
                        placeholder="Prompt para imagen final"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Dialogues */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Diálogos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Locutor 1</Label>
                      <Textarea
                        value={speaker1}
                        onChange={(e) => setSpeaker1(e.target.value)}
                        placeholder="Texto del locutor 1"
                      />
                    </div>

                    <div>
                      <Label>Locutor 2</Label>
                      <Textarea
                        value={speaker2}
                        onChange={(e) => setSpeaker2(e.target.value)}
                        placeholder="Texto del locutor 2"
                      />
                    </div>

                    <div>
                      <Label>Locutor 3</Label>
                      <Textarea
                        value={speaker3}
                        onChange={(e) => setSpeaker3(e.target.value)}
                        placeholder="Texto del locutor 3"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Video URLs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">URLs de Video</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        placeholder="URL de Google Drive"
                        onKeyPress={(e) => e.key === 'Enter' && addVideoUrl()}
                      />
                      <Button onClick={addVideoUrl} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={persistVideos}
                        onCheckedChange={(checked) => setPersistVideos(!!checked)}
                      />
                      <Label className="text-sm">Persistir entre escenas</Label>
                    </div>

                    {videoUrls.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Videos agregados:</Label>
                        {videoUrls.map((url, index) => (
                          <div key={index} className="text-sm p-2 bg-muted rounded text-ellipsis overflow-hidden">
                            Video {index + 1}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Image URLs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">URLs de Imágenes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="URL de imagen"
                        onKeyPress={(e) => e.key === 'Enter' && addImageUrl()}
                      />
                      <Button onClick={addImageUrl} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={persistImages}
                        onCheckedChange={(checked) => setPersistImages(!!checked)}
                      />
                      <Label className="text-sm">Persistir entre escenas</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Time Cuts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cortes de Tiempo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Inicio</Label>
                        <Input
                          value={cutStartTime}
                          onChange={(e) => setCutStartTime(e.target.value)}
                          placeholder="00:00"
                        />
                      </div>
                      <div>
                        <Label>Final</Label>
                        <Input
                          value={cutEndTime}
                          onChange={(e) => setCutEndTime(e.target.value)}
                          placeholder="00:30"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateScene;