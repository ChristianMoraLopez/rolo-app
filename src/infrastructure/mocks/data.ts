import { User, Location, Comment } from '@/core/entities/types';


export const mockUsers: User[] = [
  {
    _id: '1',
    name: 'Juan Administrador',
    email: 'admin@example.com',
    password: 'admin123', 
    role: 'admin',
    location: 'Chapinero',
    avatar: '/avatars/juan.jpg',
    createdAt: new Date('2024-01-01'),
    authProvider: 'email',
  },
  {
    _id: '2',
    name: 'María Suscriptora',
    email: 'maria@example.com',
    password: 'maria123',
    role: 'subscriber',
    location: 'Usaquén',
    avatar: '/avatars/maria.jpg',
    createdAt: new Date('2024-01-02'),
    authProvider: 'email',
  },
  {
    _id: '3',
    name: 'Carlos Visitante',
    email: 'carlos@example.com',
    password: 'carlos123',
    role: 'visitor',
    location: 'Teusaquillo',
    avatar: '/avatars/carlos.jpg',
    createdAt: new Date('2024-01-03'),
    authProvider: 'email',
  }
];

export const mockComments: Comment[] = [
  {
    id: '2',
    content: 'Un espacio natural increíble para desconectarse de la ciudad.',
    createdAt: new Date('2024-02-03'),
    user: mockUsers[1],
    locationId: '2'
  }
];

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Plaza Bolívar',
    description: 'El corazón histórico de Bogotá, donde se mezclan aromas de palomas, café y historia.',
    latitude: 4.598056,
    longitude: -74.075833,
    sensations: ['histórico', 'bullicioso', 'cultural'],
    smells: ['café', 'comida callejera', 'palomas'],
    images: [
      { src: 'https://images.pexels.com/photos/4400974/pexels-photo-4400974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', width: 800, height: 600 },
      { src: 'https://images.pexels.com/photos/4400977/pexels-photo-4400977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', width: 800, height: 600 }
    ],
    createdAt: new Date('2024-02-01'),
    createdBy: mockUsers[1],
    comments: [
      {
        id: '1',
        content: 'Un lugar emblemático con una mezcla única de aromas.',
        createdAt: new Date('2024-02-02'),
        user: mockUsers[0],
        locationId: '1'
      }
    ]
  },
  {
    id: '2',
    name: 'Quebrada La Vieja',
    description: 'Un sendero ecológico en los cerros orientales de Bogotá, con vegetación exuberante y aire puro.',
    latitude: 4.627639,
    longitude: -74.051374,
    sensations: ['tranquilo', 'natural', 'fresco'],
    smells: ['tierra húmeda', 'pinos', 'agua fresca'],
    images: [
      { src: 'https://images.pexels.com/photos/775206/pexels-photo-775206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', width: 800, height: 600 },
      { src: 'https://images.pexels.com/photos/710906/pexels-photo-710906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', width: 800, height: 600 }
    ],
    createdAt: new Date('2024-02-05'),
    createdBy: mockUsers[0],
    comments: [
      {
        id: '2',
        content: 'Un espacio natural increíble para desconectarse de la ciudad.',
        createdAt: new Date('2024-02-03'),
        user: mockUsers[1],
        locationId: '2'
      }
    ]
  }
];