export function createZodValidator(schema) {
  return (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {};
    }

    return result.error.issues.reduce((errors, issue) => {
      const field = issue.path[0];
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
      return errors;
    }, {});
  };
}
