// src/components/features/CommentSection.tsx
'use client'; 
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Comment } from '@/core/entities/types';

interface CommentSectionProps {
  comments: Comment[];
  locationId: string;
}

export function CommentSection({ comments,  }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  // En un caso real, esto vendría de un contexto de autenticación
  const isAuthenticated = false;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el comentario al backend
    setNewComment('');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentarios ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <Textarea
              placeholder="Comparte tu experiencia sobre este lugar..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4"
            />
            <Button 
              type="submit" 
              className="bg-azulprimary hover:bg-azulhover"
              disabled={!newComment.trim()}
            >
              Publicar comentario
            </Button>
          </form>
        ) : (
          <div className="bg-azulsecundario/10 p-4 rounded-lg mb-8">
            <p className="text-center">
              <a href="/login" className="text-azulprimary hover:text-azulhover">
                Inicia sesión
              </a>{' '}
              para dejar un comentario
            </p>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback>
                  {comment.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-foreground/90">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}