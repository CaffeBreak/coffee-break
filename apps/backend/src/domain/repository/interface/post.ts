import { Result } from "@cffnpwr/result-ts";

import { Post } from "./../../entity/post";

// import { RoomId } from "@/domain/entity/room";
import { RepositoryError } from "@/error/repository";

export interface IPostRepository {
  // getpost(roomid: RoomId): Promise<Result<Post[], RepositoryError>>;
  save(post: Post): Promise<Result<Post, RepositoryError>>;
}
