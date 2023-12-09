import { Err, Ok, Result } from "@cffnpwr/result-ts";
import { inject, injectable } from "tsyringe";

import { PlayerId } from "@/domain/entity/player";
import { Post, messagetype } from "@/domain/entity/post";
import { RoomId } from "@/domain/entity/room";
import { IPostRepository } from "@/domain/repository/interface/post";
import { RepositoryOperationError, UseCaseError } from "@/error/usecase/common";

@injectable()
export class CreatePostUseCase {
  constructor(@inject("PostRepository") private readonly postRepository: IPostRepository) {}

  public async execute(
    playerid: PlayerId,
    message: messagetype,
    roomID: RoomId,
  ): Promise<Result<Post, UseCaseError>> {
    const newPost = new Post(playerid, message, roomID);
    const postResult = await this.postRepository.save(newPost);
    if (postResult.isErr()) {
      return new Err(new RepositoryOperationError(postResult.unwrapErr()));
    }

    return new Ok(postResult.unwrap());
  }
}
