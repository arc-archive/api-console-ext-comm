export default {
  files: "test/**/*.test.js",
  nodeResolve: true,
  middleware: [
    function rewriteBase(context, next) {
      if (context.url.indexOf("/base") === 0) {
        context.url = context.url.replace("/base", "");
      }
      return next();
    },
  ],
  testFramework: {
    config: {
      timeout: 100000,
    },
  },
	browserStartTimeout: 20000,
	testsStartTimeout: 20000,
	testsFinishTimeout: 130000,
};
