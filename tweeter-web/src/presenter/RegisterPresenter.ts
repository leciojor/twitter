import { RegisterService } from "../model.service/RegisterService";
import { Buffer } from "buffer";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (imageUrl: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private registerService: RegisterService;
  private _imageBytes: Uint8Array = new Uint8Array();
  private _imageFileExtension: string = "";

  public constructor(view: RegisterView) {
    super(view);
    this.registerService = new RegisterService();
  }

  protected itemDescription(): string {
    return "register user";
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
    await this.doAuthentication(
      async () => {
        const [user, authToken] = await this.registerService.register(
          firstName,
          lastName,
          alias,
          password,
          this.imageBytes,
          this.imageFileExtension,
        );
        return [user, authToken];
      },
      rememberMe,
      () => {
        this.view.navigateTo(`/feed/${alias}`);
      },
    );
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
