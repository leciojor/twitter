import { User, AuthToken } from "tweeter-shared";
import { RegisterService } from "../model.service/RegisterService";
import { Buffer } from "buffer";

export interface RegisterView {
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigateTo: (path: string) => void;
}

export class RegisterPresenter {
  private registerService: RegisterService;
  private view: RegisterView;
  private _isLoading: boolean = false;
  private _password: string = "";
  private _rememberMe: boolean = false;
  private _alias: string = "";
  private _firstName: string = "";
  private _lastName: string = "";
  private _imageUrl: string = "";
  private _imageBytes: Uint8Array = new Uint8Array();
  private _imageFileExtension: string = "";

  public constructor(view: RegisterView) {
    this.view = view;
    this.registerService = new RegisterService();
  }

  public checkSubmitButtonStatus(): boolean {
    return (
      !this.firstName ||
      !this.lastName ||
      !this.alias ||
      !this.password ||
      !this.imageUrl ||
      !this.imageFileExtension
    );
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.imageUrl = URL.createObjectURL(file);

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
      this.imageUrl = "";
      this.imageBytes = new Uint8Array();
    }
  }

  public async doRegister() {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.registerService.register(
        this.firstName,
        this.lastName,
        this.alias,
        this.password,
        this.imageBytes,
        this.imageFileExtension,
      );

      this.view.updateUserInfo(user, user, authToken, this.rememberMe);
      this.view.navigateTo(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this.isLoading = false;
    }
  }

  public get isLoading() {
    return this._isLoading;
  }

  public get alias() {
    return this._alias;
  }

  public get firstName() {
    return this._firstName;
  }

  public get lastName() {
    return this._lastName;
  }

  public get imageUrl() {
    return this._imageUrl;
  }

  public get imageFileExtension() {
    return this._imageFileExtension;
  }

  public get imageBytes() {
    return this._imageBytes;
  }

  public set alias(alias: string) {
    this._alias = alias;
  }

  public set firstName(firstName: string) {
    this._firstName = firstName;
  }

  public set lastName(lastName: string) {
    this._lastName = lastName;
  }

  public set password(password: string) {
    this._password = password;
  }

  public set rememberMe(rememberMe: boolean) {
    this._rememberMe = rememberMe;
  }

  protected set isLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }

  protected set imageUrl(imageUrl: string) {
    this._imageUrl = imageUrl;
  }

  protected set imageFileExtension(imageFileExtension: string) {
    this._imageFileExtension = imageFileExtension;
  }

  protected set imageBytes(imageBytes: Uint8Array) {
    this._imageBytes = imageBytes;
  }
}
