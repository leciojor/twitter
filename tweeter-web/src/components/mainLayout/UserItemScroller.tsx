import InfiniteScroll from "react-infinite-scroll-component";
import UserItem from "../userItem/UserItem";
import { User } from "tweeter-shared";
import { useUserInfo } from "../userInfo/UserHooks";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserActions } from "../userInfo/UserHooks";
import {
  UserItemPresenter,
  UserItemView,
} from "../../presenter/UserItemPresenter";

interface Props {
  featureUrl: string;
  presenterFactory: (view: UserItemView) => UserItemPresenter;
}

const StatusItem = (props: Props) => {
  const { featureUrl } = props;
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<User[]>([]);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: UserItemView = {
    addItems: (newItems: User[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<UserItemPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  const reset = async () => {
    setItems(() => []);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenterRef
        .current!.getUser(authToken!, displayedUserAliasParam!)
        .then((toUser) => {
          if (toUser) {
            setDisplayedUser(toUser);
          }
        });
    }
  }, [displayedUserAliasParam]);

  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  return (
    <>
      <div className="container px-0 overflow-visible vh-100">
        <InfiniteScroll
          className="pr-0 mr-0"
          dataLength={items.length}
          next={loadMoreItems}
          hasMore={presenterRef.current!.hasMoreItems}
          loader={<h4>Loading...</h4>}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="row mb-3 mx-0 px-0 border rounded bg-white"
            >
              <UserItem user={item} featurePath={featureUrl} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default StatusItem;
