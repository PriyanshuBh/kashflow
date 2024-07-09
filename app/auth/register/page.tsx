import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col p-5 shadow-lg w-full md:w-[30%] border rounded-md">
        <h1 className="mb-10 text-center bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-3xl font-bold text-transparent">
          Register
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
