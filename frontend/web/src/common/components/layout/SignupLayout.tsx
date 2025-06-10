interface SignupLayoutProps {
  children: React.ReactNode;
}

export const SignupLayout: React.FC<SignupLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen px-4 sm:px-8 md:px-12 lg:px-24 xl:px-48 flex items-center justify-center bg-ora-bg">
      <div className="w-full max-w-7xl">
        <div className="bg-ora-purple/20 border-l-16 border-ora-purple rounded-l-none rounded-r-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="lg:w-1/2 flex items-center justify-center p-8">
              <img
                src="/assets/images/signup.png"
                alt="Sign up illustration"
                className="w-full h-auto"
              />
            </div>
            <div className="lg:w-1/2 p-8 lg:p-12 flex items-center">
              <div className="w-full max-w-md mx-auto lg:mx-0 lg:mr-32">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupLayout;
