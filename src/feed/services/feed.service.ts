import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { User } from '../../auth/models/user.interface';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { FeedPostEntity } from '../models/post.entity';
import { FeedPost } from '../models/post.interface';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
  ) {}

  createPost(user: User, feedPost: FeedPost): Observable<FeedPost> {
    feedPost.author = user;
    return from(this.feedPostRepository.save(feedPost));
  }

  findAllPost(): Observable<FeedPost[]> {
    return from(this.feedPostRepository.find());
  }

  findPosts(take = 10, skip = 0): Observable<FeedPost[]> {
    return from(
      this.feedPostRepository
        .findAndCount({
          take,
          skip,
        })
        .then(([posts]) => {
          return <FeedPost[]>posts;
        }),
    );
  }
  updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult> {
    return from(this.feedPostRepository.update(id, feedPost));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.feedPostRepository.delete(id));
  }
  findPostById(id: number): Observable<FeedPost> {
    return from(
      this.feedPostRepository.findOne({
        where: { id },
        relations: ['author'],
      }),
    );
  }
}
