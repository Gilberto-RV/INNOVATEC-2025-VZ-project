export class EventUseCases {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async getAllEvents() {
    return await this.eventRepository.getAllEvents();
  }

  async getActiveEvents() {
    return await this.eventRepository.getActiveEvents();
  }

  async getEventById(id) {
    if (!id) {
      throw new Error('ID del evento es requerido');
    }
    return await this.eventRepository.getEventById(id);
  }

  async getUpcomingEvents() {
    const events = await this.getActiveEvents();
    const now = new Date();
    
    return events
      .filter(event => event.date >= now)
      .sort((a, b) => a.date - b.date);
  }
}