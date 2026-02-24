import { User, AuthToken } from "tweeter-shared";
import { RegisterService } from "../model.service/RegisterService";
import { Buffer } from "buffer";
import { View, Presenter } from "./Presenter";

export interface RegisterView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigateTo: (path: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setImageUrl: (imageUrl: string) => void;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  private registerService: RegisterService;
  private _imageBytes: Uint8Array = new Uint8Array();
  private _imageFileExtension: string = "";

  public constructor(view: RegisterView) {
    super(view);
    this.registerService = new RegisterService();
  }

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !this.imageFileExtension
    );
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
      }
    } else {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
    }
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    rememberMe: boolean,
  ) {
    try {
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.registerService.register(
          firstName,
          lastName,
          alias,
          password,
          this.imageBytes,
          this.imageFileExtension,
        );

        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.view.navigateTo(`/feed/${user.alias}`);
      }, "register user");
    } finally {
      this.view.setIsLoading(false);
    }
  }

  public get imageFileExtension() {
    return this._imageFileExtension;
  }

  public get imageBytes() {
    return this._imageBytes;
  }

  protected set imageFileExtension(imageFileExtension: string) {
    this._imageFileExtension = imageFileExtension;
  }

  protected set imageBytes(imageBytes: Uint8Array) {
    this._imageBytes = imageBytes;
  }
}
