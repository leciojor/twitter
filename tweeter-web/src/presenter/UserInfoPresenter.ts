import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setIsFollower: (isFollower: boolean) => void;
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    }, "determine follower status");
  }

  private async setFollowCount(
    authToken: AuthToken,
    displayedUser: User,
    getCount: (authToken: AuthToken, user: User) => Promise<number>,
    setCount: (count: number) => void,
    itemDescription: string,
  ) {
    await this.doFailureReportingOperation(async () => {
      const count = await getCount(authToken, displayedUser);
      setCount(count);
    }, itemDescription);
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.setFollowCount(
      authToken,
      displayedUser,
      (token, user) => this.followService.getFolloweeCount(token, user),
      (count) => this.view.setFolloweeCount(count),
      "get followees count",
    );
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.setFollowCount(
      authToken,
      displayedUser,
      (token, user) => this.followService.getFollowerCount(token, user),
      (count) => this.view.setFollowerCount(count),
      "get followers count",
    );
  }

  private async actDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    displayedUserAct: string,
    itemDescription: string,
    isFollower: boolean,
    userAct: (
      authToken: AuthToken,
      userToAct: User,
    ) => Promise<[followerCount: number, followeeCount: number]>,
  ) {
    let userToast = "";
    try {
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        userToast = this.view.displayInfoMessage(
          `${displayedUserAct} ${displayedUser.name}...`,
          0,
        );

        await userAct(authToken, displayedUser);

        const followerCount = await this.followService.getFollowerCount(
          authToken,
          displayedUser,
        );
        const followeeCount = await this.followService.getFolloweeCount(
          authToken,
          displayedUser,
        );

        this.view.setIsFollower(isFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      }, itemDescription);
    } finally {
      this.view.deleteMessage(userToast);
      this.view.setIsLoading(false);
    }
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
    await this.actDisplayedUser(
      authToken,
      displayedUser,
      "Following",
      "follow user",
      true,
      (token, user) => this.followService.follow(token, user),
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ) {
    await this.actDisplayedUser(
      authToken,
      displayedUser,
      "Unfollowing",
      "unfollow user",
      false,
      (token, user) => this.followService.unfollow(token, user),
    );
  }
}
