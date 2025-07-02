import { EventRepository } from '../../core/repositories/EventRepository';
import { Event } from '../../core/entities/Event';

export class MockEventRepository extends EventRepository {
  constructor() {
    super();
    this.events = [
      new Event({
        id: '1',
        title: 'Semana de la Ciencia',
        description: 'Eventos y conferencias sobre ciencias naturales',
        image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg',
        date: new Date('2024-02-15'),
        location: 'Laboratorio de Ciencias',
        isActive: true,
      }),
      new Event({
        id: '2',
        title: 'Torneo Deportivo Inter-Grupos',
        description: 'Competencias deportivas entre diferentes grupos',
        image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
        date: new Date('2024-02-20'),
        location: 'Centro Deportivo',
        isActive: true,
      }),
      new Event({
        id: '3',
        title: 'Conferencia Magistral',
        description: 'Conferencia sobre innovación educativa',
        image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
        date: new Date('2024-02-25'),
        location: 'Auditorio',
        isActive: true,
      }),
    ];
  }

  async getAllEvents() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.events]);
      }, 400);
    });
  }

  async getActiveEvents() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activeEvents = this.events.filter(event => event.isActive);
        resolve(activeEvents);
      }, 400);
    });
  }

  async getEventById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = this.events.find(e => e.id === id);
        if (event) {
          resolve(event);
        } else {
          reject(new Error('Evento no encontrado'));
        }
      }, 300);
    });
  }
}