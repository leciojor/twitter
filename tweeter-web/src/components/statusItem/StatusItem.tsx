import { Link, useNavigate } from "react-router-dom";
import { Status, User, AuthToken, FakeData } from "tweeter-shared";
import Post from "../statusItem/Post";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserActions, useUserInfo } from "../userInfo/UserHooks";

interface Props {
  item: Status;
  featurePath: string;
}

const StatusItem = (props: Props) => {
  const { item, featurePath } = props;
  const { displayErrorMessage } = useMessageActions();
  const { setDisplayedUser } = useUserActions();
  const { displayedUser, authToken } = useUserInfo();

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
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
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
