export const getFullName = ({
  name,
  alias,
}: {
  name: string;
  alias?: string[];
}) => {
  return `${name}${alias?.length ? `(${alias.join("、")})` : ""}`;
};

export const getFullNames = (
  args: InferFuncOneParamType<typeof getFullName>[]
) => {
  return args.map(getFullName).join("、");
};
