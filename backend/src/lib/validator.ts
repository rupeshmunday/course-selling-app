// zod-based Validator class
import { NextFunction, Request, Response } from "express";
import { z, ZodSchema } from "zod";
import ErrorException from "./errorException";
import CommonFunctions from "./commonFunctions";

class Validator {
  public async validate(
    schema: ZodSchema<any>,
    dbMapping: Record<string, string>,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instance = req.body;

      const parsed = schema.safeParse(instance);

      if (!parsed.success) {
        throw new ErrorException(
          "ValidationError",
          parsed.error.errors[0].message || parsed.error.format()
        );
      }

      (req as any).mappedJson = await this.instanceMapping(instance, dbMapping);

      if ((req as any).user) {
        (req as any).mappedJson = CommonFunctions.prototype.setDefaultAttributes(
          req.method === "POST",
          (req as any).user,
          (req as any).mappedJson
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  private async instanceMapping(instance: any, mapping: Record<string, string>): Promise<any> {
    if (!instance || (Array.isArray(instance) && instance.length === 0)) {
      return instance;
    }

    if (!Array.isArray(instance)) {
      const mappedJson: any = {};

      for (const key in instance) {
        if (!Object.prototype.hasOwnProperty.call(mapping, key)) continue;

        const mappedKey = mapping[key];
        const value = instance[key];

        if (typeof value === "object" && value !== null && key !== "_id") {
          if (value instanceof Date) {
            mappedJson[mappedKey] = value.toISOString();
          } else if (Array.isArray(value)) {
            mappedJson[mappedKey] = [];

            for (const item of value) {
              if (typeof item === "object") {
                const result = await this.instanceMapping(item, mapping);
                if (result) mappedJson[mappedKey].push(result);
              } else {
                mappedJson[mappedKey].push(item);
              }
            }
          } else {
            mappedJson[mappedKey] = await this.instanceMapping(value, mapping);
          }
        } else {
          if (Array.isArray(value) && key !== "_id") continue;

          mappedJson[mappedKey] =
            typeof value === "number" || typeof value === "boolean" || !isNaN(Number(value))
              ? value
              : value?.toString().trim();
        }
      }

      return mappedJson;
    } else {
      const mappedArray = [];
      for (const val of instance) {
        const result = await this.instanceMapping(val, mapping);
        if (result) mappedArray.push(result);
      }
      return mappedArray;
    }
  }
}

export default new Validator();
