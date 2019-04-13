import { BaseService } from './BaseService';
import { ChapterModel } from '../models/ChapterModel';

class ChapterService extends BaseService {
  endpoint = 'api/chapter';

  list = filters => {
    return super.list(filters).then(chapters => {
      return chapters.map(c => new ChapterModel(c));
    });
  };

  save = chapter => {
    return super.save(chapter).then(c => new ChapterModel(c));
  };

  update = (id, chapter) => {
    return super.update(id, chapter).then(c => new ChapterModel(c));
  };
}

export const chapterService = new ChapterService();
