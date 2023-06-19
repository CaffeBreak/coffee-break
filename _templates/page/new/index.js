module.exports = {
  prompt: ({ prompter }) => {
    const question = [
      {
        type: "input",
        name: "dir",
        message: "What is page path?",
        initial: "./",
      },
      {
        type: "input",
        name: "name",
        message: "What is page name?",
      },
    ];

    return prompter.prompt(question).then(async (answers) => {
      const { dir, name } = answers;
      const { join } = require("node:path");
      const camelCase = (await import("camelcase")).default;
      const kebabCase = (text) => {
        return text
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase()
          .trim()
          .split(/\s+|_+/)
          .join("-");
      };

      const path = join("apps/frontend/src/app/", dir, "/", kebabCase(name));
      const pascalName = camelCase(name, { pascalCase: true, preserveConsecutiveUppercase: true });

      return { ...answers, name: pascalName, path };
    });
  },
};
