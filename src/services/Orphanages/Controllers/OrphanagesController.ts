import { Request, Response} from 'express';
import { getRepository } from 'typeorm';
import Orphanages from '../Entities/Orphanages';
import orphanagesView from '../Views/orphanages_view';

export default {
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanages);

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });

    return response.json(orphanagesView.renderMany(orphanages));
  },

  async create(request: Request, response: Response) {
    const {
      nome,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;
  
    const orphanagesRepository = getRepository(Orphanages);

    const requestImages = request.files as Express.Multer.File[];
    const images = requestImages.map(image => {
      return { path: image.filename };
    })
    const orphanages = orphanagesRepository.create({
      nome,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images,
    });
  
    await orphanagesRepository.save(orphanages);

    return response.json(orphanages);
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const orphanagesRepository = getRepository(Orphanages);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return response.json(orphanagesView.render(orphanage));
  },
}