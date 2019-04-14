import { BaseService } from './BaseService';
import { ChapterModel } from '../models/ChapterModel';

const defaultFilters = {
  parentChapter: { op: 'equals', value: '', options: { allowEmpty: true } },
};

class ChapterService extends BaseService {
  endpoint = 'api/chapter/:story';

  list = (filters = defaultFilters) => {
    return super.list(filters).then(chapters => {
      return chapters.map(c => {
        const chapter = new ChapterModel(c);
        chapter.subChapters = chapter.subChapters.map(subChapter => {
          return new ChapterModel(subChapter);
        });
        return chapter;
      });
    });
  };

  save = chapter => {
    return super.save(chapter).then(c => new ChapterModel(c));
  };

  update = (id, chapter) => {
    return super.update(id, chapter).then(c => new ChapterModel(c));
  };
}


class PublicChapterService extends BaseService {
  endpoint = 'public/chapter/:story';

  list = (filters = defaultFilters) => {
    return super.list(filters).then(chapters => {
      return chapters.map(c => {
        const chapter = new ChapterModel(c);
        chapter.subChapters = chapter.subChapters.map(subChapter => {
          return new ChapterModel(subChapter);
        });
        return chapter;
      });
    });
  };
}

export const chapterService = new ChapterService();
export const publicChapterService = new PublicChapterService();
