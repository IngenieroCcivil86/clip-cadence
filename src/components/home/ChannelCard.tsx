import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '@/stores/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play, Globe } from 'lucide-react';
import heroVideoStudio from '@/assets/hero-video-studio.jpg';
import techNewsAvatar from '@/assets/tech-news-avatar.jpg';

interface ChannelCardProps {
  channel: Channel;
  viewMode: 'grid' | 'list';
}

const ChannelCard = ({ channel, viewMode }: ChannelCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/canal/${channel.id}`);
  };

  if (viewMode === 'list') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-card to-card/80 border-border/50 hover:border-primary/20 group"
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Thumbnail */}
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {!imageError && channel.imagen1 ? (
                <img
                  src={channel.imagen1}
                  alt={channel.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
                  <Play className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                {channel.titulo}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {channel.descripcion}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {channel.categorias}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Globe className="h-3 w-3 mr-1" />
                  {channel.idioma}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/90 border-border/50 hover:border-primary/20 group overflow-hidden"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        {/* Thumbnail */}
        <AspectRatio ratio={16 / 9}>
          {!imageError && channel.imagen1 ? (
            <img
              src={channel.imagen1}
              alt={channel.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted via-muted/80 to-muted/60 flex items-center justify-center">
              <Play className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </AspectRatio>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-start space-x-3">
            {/* Channel avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {!imageError && channel.imagen2 ? (
                <img
                  src={channel.imagen2}
                  alt={`${channel.titulo} avatar`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Play className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>

            {/* Title and description */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
                {channel.titulo}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {channel.descripcion}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {channel.categorias}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Globe className="h-3 w-3 mr-1" />
              {channel.idioma}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelCard;