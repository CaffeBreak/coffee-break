module.exports = {
  prompt: ({ prompter }) => {
    const question = [
      {
        type: "select",
        name: "dir",
        message: "Select component directory",
        choices: ["components/", "components/ui", "components/ui/form", "components/ui/global"],
      },
      {
        type: "input",
        name: "name",
        message: "What is component name?",
      },
      {
        type: "confirm",
        name: "hasProps",
        message: "Dose it have props?",
        choices: ["Yes", "No"],
        initial: "Yes",
      },
    ];

    return prompter.prompt(question).then(async (answers) => {
      const { dir, name, hasProps } = answers;
      const { join } = require("node:path");
      const camelCase = (await import("camelcase")).default;

      const path = join(
        "src/",
        dir,
        "/",
        camelCase(name, { pascalCase: false, preserveConsecutiveUppercase: true }),
      );
      const pascalName = camelCase(name, { pascalCase: true, preserveConsecutiveUppercase: true });
      const typeAnnotation = hasProps ? `NextPage<${pascalName}Props>` : "NextPage";
      const props = hasProps ? "(props)" : "()";

      return { ...answers, name: pascalName, path, typeAnnotation, props };
    });
  },
};
