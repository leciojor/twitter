import { ToastType } from "../toaster/Toast";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Status, User, AuthToken, FakeData } from "tweeter-shared";
import {
  UserInfoActionsContext,
  UserInfoContext,
} from "../userInfo/UserInfoContexts";
import Post from "../statusItem/Post";

interface Props {
  item: Status;
  featurePath: string;
}

const StatusItem = (props: Props) => {
  const { item, featurePath } = props;
  const { displayToast } = useContext(ToastActionsContext);
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const { displayedUser, authToken } = useContext(UserInfoContext);

  const navigate = useNavigate();

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to get user because of exception: ${error}`,
        0,
      );
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={item.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {item.user.firstName} {item.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`${props.featurePath}/${item.user.alias}`}
                onClick={navigateToUser}
              >
                {item.user.alias}
              </Link>
            </h2>
            {item.formattedDate}
            <br />
            <Post status={item} featurePath={featurePath} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
