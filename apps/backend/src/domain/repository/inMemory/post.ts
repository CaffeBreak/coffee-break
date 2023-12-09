import { Ok, Result } from "@cffnpwr/result-ts";
import { singleton } from "tsyringe";

import { IPostRepository } from "./../interface/post";

import { Post } from "@/domain/entity/post";
import { RoomId } from "@/domain/entity/room";
import { DataNotFoundError, RepositoryError } from "@/error/repository";
import { OkOrErr } from "@/misc/result";

@singleton()
export class InMemoryPostRepository implements IPostRepository {
  public store: Post[] = [];
  getpost(roomid: RoomId): Promise<Result<Post[], RepositoryError>> {
    return new Promise((resolve) => {
      resolve(
        OkOrErr(
          this.store.filter((post) => post.roomID === roomid),
          new DataNotFoundError(),
        ),
      );
    });
  }

  save(post: Post): Promise<Result<Post, RepositoryError>> {
    const index = this.store.findIndex((p) => p === post);
    if (index !== -1) {
      this.store[index] = post;

      return new Promise((resolve) => {
        resolve(new Ok(this.store[index]));
      });
    }

    const newIndex = this.store.push(post) - 1;

    return new Promise((resolve) => {
      resolve(new Ok(this.store[newIndex]));
    });
  }
}
