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
  Play,
  X
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
  const [videoUrls, setVideoUrls] = useState<string[]>([
    'https://drive.google.com/file/d/demo123/view',
    'https://drive.google.com/file/d/demo456/view',
    'https://drive.google.com/file/d/demo789/view'
  ]);
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
      
      if (scene.video_sources?.length > 0) {
        setSelectedVideoUrl(scene.video_sources[0].url);
      }
    }
  }, [scene]);

  const handleBack = () => {
    navigate(`/canal/${channelId}/edit/${videoId}`);
  };

  const addVideoUrl = () => {
    if (newVideoUrl.trim()) {
      setVideoUrls([...videoUrls, newVideoUrl.trim()]);
      setNewVideoUrl('');
      toast({
        title: "URL agregada",
        description: "La URL de video se ha agregado correctamente"
      });
    }
  };

  const removeVideoUrl = (index: number) => {
    setVideoUrls(videoUrls.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
      toast({
        title: "Imagen agregada",
        description: "La URL de imagen se ha agregado correctamente"
      });
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
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
        ...(speaker1 && {
          speaker1: {
            voice_type: 'voz_masculina_profunda',
            text_speaker: speaker1
          }
        }),
        ...(speaker2 && {
          speaker2: {
            voice_type: 'voz_femenina_clara',
            text_speaker: speaker2
          }
        }),
        ...(speaker3 && {
          speaker3: {
            voice_type: 'voz_masculina_joven',
            text_speaker: speaker3
          }
        })
      }].filter(dialogue => Object.keys(dialogue).length > 0),
      video_sources: selectedVideoUrl ? [{
        id: 'clip1',
        url: selectedVideoUrl,
        cuts: cutStartTime && cutEndTime ? [{
          part: 'main',
          time_range: `${cutStartTime}-${cutEndTime}`
        }] : []
      }] : [],
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
      
      setVideoUrls([
        'https://drive.google.com/file/d/demo123/view',
        'https://drive.google.com/file/d/demo456/view',
        'https://drive.google.com/file/d/demo789/view'
      ]);
      setImageUrls([]);
      setCutStartTime('');
      setCutEndTime('');
      setNewVideoUrl('');
      setNewImageUrl('');
      
      toast({
        title: "Escena reseteada",
        description: "Todos los cambios han sido descartados"
      });
    }
  };

  if (!project || !scene) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton onBack={handleBack} />
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
      <Header showBackButton onBack={handleBack} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6 h-[calc(100vh-120px)]">
          {/* Video Player - 70% */}
          <div className="flex-1 space-y-4">
            <div>
              <Label className="text-lg font-semibold">Selector de Video</Label>
              <Select value={selectedVideoUrl} onValueChange={setSelectedVideoUrl}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Selecciona un video de Google Drive" />
                </SelectTrigger>
                <SelectContent>
                  {videoUrls.map((url, index) => (
                    <SelectItem key={index} value={url}>
                      {url.includes('demo123') ? 'Tutorial React - Introducción' : 
                       url.includes('demo456') ? 'Tutorial React - Hooks' : 
                       url.includes('demo789') ? 'Tutorial React - Estado' : 
                       `Video personalizado ${index + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Google Drive Video Player Mockup */}
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center border">
              {selectedVideoUrl ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white space-y-2">
                    <div className="w-20 h-20 mx-auto bg-red-600 rounded-full flex items-center justify-center mb-4">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                    <p className="text-lg font-medium">Google Drive Player</p>
                    <p className="text-sm opacity-75">
                      Reproduciendo: {selectedVideoUrl.includes('demo123') ? 'Tutorial React - Introducción' : 
                        selectedVideoUrl.includes('demo456') ? 'Tutorial React - Hooks' : 
                        selectedVideoUrl.includes('demo789') ? 'Tutorial React - Estado' : 'Video personalizado'}
                    </p>
                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                      <span>00:12 / 05:43</span>
                      <div className="w-32 h-1 bg-gray-600 rounded">
                        <div className="w-8 h-1 bg-red-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Selecciona un video para reproducir</p>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel - 30% */}
          <ScrollArea className="w-96 h-full">
            <div className="space-y-6 pr-4">
              {/* Scene Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información de la Escena</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">ID de Escena</Label>
                    <p className="text-sm text-muted-foreground mt-1">#{scene.id}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Tiempo de inicio - fin</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {String(Math.floor((scene.id - 1) * 20 / 60)).padStart(2, '0')}:
                      {String((scene.id - 1) * 20 % 60).padStart(2, '0')} - 
                      {String(Math.floor(scene.id * 20 / 60)).padStart(2, '0')}:
                      {String(scene.id * 20 % 60).padStart(2, '0')}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción de la escena</Label>
                    <Textarea
                      id="description"
                      value={sceneDescription}
                      onChange={(e) => setSceneDescription(e.target.value)}
                      placeholder="Describe lo que sucede en esta escena..."
                      className="mt-1"
                    />
                  </div>

                  <Separator />
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Diálogos de locutores</Label>
                    
                    <div>
                      <Label htmlFor="speaker1" className="text-xs text-muted-foreground">Locutor 1</Label>
                      <Textarea
                        id="speaker1"
                        value={speaker1}
                        onChange={(e) => setSpeaker1(e.target.value)}
                        placeholder="Texto del locutor 1..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="speaker2" className="text-xs text-muted-foreground">Locutor 2</Label>
                      <Textarea
                        id="speaker2"
                        value={speaker2}
                        onChange={(e) => setSpeaker2(e.target.value)}
                        placeholder="Texto del locutor 2 (opcional)..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="speaker3" className="text-xs text-muted-foreground">Locutor 3</Label>
                      <Textarea
                        id="speaker3"
                        value={speaker3}
                        onChange={(e) => setSpeaker3(e.target.value)}
                        placeholder="Texto del locutor 3 (opcional)..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video URLs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">URLs de Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="flex-1"
                    />
                    <Button size="sm" onClick={addVideoUrl}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="persist-videos"
                      checked={persistVideos}
                      onCheckedChange={(checked) => setPersistVideos(!!checked)}
                    />
                    <Label htmlFor="persist-videos" className="text-xs">Persistir entre escenas</Label>
                  </div>

                  {videoUrls.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <span className="flex-1 truncate">{url}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeVideoUrl(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Image URLs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">URLs de Imágenes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Imagen inicial</Label>
                    <Textarea
                      value={startPrompt}
                      onChange={(e) => setStartPrompt(e.target.value)}
                      placeholder="Prompt para imagen inicial..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Imagen final</Label>
                    <Textarea
                      value={endPrompt}
                      onChange={(e) => setEndPrompt(e.target.value)}
                      placeholder="Prompt para imagen final..."
                      className="mt-1"
                    />
                  </div>

                  <Separator />

                  <div className="flex space-x-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="URL de imagen adicional..."
                      className="flex-1"
                    />
                    <Button size="sm" onClick={addImageUrl}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="persist-images"
                      checked={persistImages}
                      onCheckedChange={(checked) => setPersistImages(!!checked)}
                    />
                    <Label htmlFor="persist-images" className="text-xs">Persistir entre escenas</Label>
                  </div>

                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <span className="flex-1 truncate">{url}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeImageUrl(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Cut Times */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tiempos de Corte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="cut-start" className="text-xs">Inicio</Label>
                      <Input
                        id="cut-start"
                        value={cutStartTime}
                        onChange={(e) => setCutStartTime(e.target.value)}
                        placeholder="00:00"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cut-end" className="text-xs">Fin</Label>
                      <Input
                        id="cut-end"
                        value={cutEndTime}
                        onChange={(e) => setCutEndTime(e.target.value)}
                        placeholder="00:30"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default CreateScene;