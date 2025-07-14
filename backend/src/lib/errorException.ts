import { exceptionConfig } from "./exception";

type ExceptionKeys = keyof typeof exceptionConfig;

export default class ErrorException extends Error {
    exception = exceptionConfig;
    status: number;
    error: any;
    constructor(errorException: ExceptionKeys, message: any='') {
        super(message);
        const exceptionError:any = JSON.parse(JSON.stringify(this.exception[errorException]));
        exceptionError.message = (message)? message: exceptionError.message;
        this.status = exceptionError.status;
        delete exceptionError.status;
        this.error =  exceptionError;
    }
}
