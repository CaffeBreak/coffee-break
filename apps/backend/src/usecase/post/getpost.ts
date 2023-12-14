import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import type { IPostRepository } from "@/domain/repository/interface/post";

import { Post } from "@/domain/entity/post";
import { RoomId } from "@/domain/entity/room";
import { RepositoryError } from "@/error/repository";
import { RepositoryOperationError } from "@/error/usecase/common";

@injectable()
export class GetPostUseCase {
  constructor(@inject("PostRepository") private readonly postRepository: IPostRepository) {}

  public async execute(roomid: RoomId): Promise<Result<Post[], RepositoryError>> {
    const postResult = await this.postRepository.getpost(roomid);
    if (postResult.isErr()) {
      return new Err(new RepositoryOperationError(postResult.unwrapErr()));
    }

    return new Ok(postResult.unwrap());
  }
}
