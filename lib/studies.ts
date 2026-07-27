import { readFileSync, readdirSync } from "fs";
import path from "path";
import Ajv2020 from "ajv/dist/2020";
import type { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import type { ConventionsJudgeStudyExport } from "./generated/study-export";

const STUDIES_DIR = path.join(process.cwd(), "data", "studies");
const SCHEMA_PATH = path.join(
  process.cwd(),
  "schemas",
  "judge-study-export.schema.json",
);

function compileValidator() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf-8"));
  return ajv.compile<ConventionsJudgeStudyExport>(schema);
}

export function loadStudies(): ConventionsJudgeStudyExport[] {
  const validate = compileValidator();
  const files = readdirSync(STUDIES_DIR).filter((f) => f.endsWith(".json"));

  return files.map((file) => {
    const filePath = path.join(STUDIES_DIR, file);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));

    if (!validate(data)) {
      const errors = ajvErrorsText(validate.errors);
      throw new Error(
        `${filePath} does not conform to schemas/judge-study-export.schema.json:\n${errors}`,
      );
    }

    return data;
  });
}

function ajvErrorsText(errors: ErrorObject[] | null | undefined): string {
  if (!errors) return "unknown validation error";
  return errors
    .map((e) => `  ${e.instancePath || "/"} ${e.message}`)
    .join("\n");
}
