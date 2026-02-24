import { User } from "tweeter-shared/dist/model/domain/User";
import { PagedItemPresenter } from "./PagedItemPresenters";
import { FollowService } from "../model.service/FollowService";

export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  FollowService
> {
  protected serviceFactory(): FollowService {
    return new FollowService();
  }
}
