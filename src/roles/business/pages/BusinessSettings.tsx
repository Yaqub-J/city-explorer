import { Button } from "@/components/ui/button";
// import { useLoginMutation } from "@/app/authApiSlice";
// import { useDispatch } from "react-redux";
import { useToast } from "@/context/ToastContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { settingsSchema, type SettingsSchema } from "./schema";
// import { login } from "./authSlice";
import CustomTextField from "@/components/inputs/CustomTextField";
import { zodResolver } from "@hookform/resolvers/zod";

const BusinessSettings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsSchema>({ resolver: zodResolver(settingsSchema) });
  const { showToast } = useToast();

  // const dispatch = useDispatch();

  // const [loginRequest] = useLoginMutation();

  const onSubmit: SubmitHandler<SettingsSchema> = async (data) => {
    try {
      // const userData = await loginRequest(data).unwrap();
      // dispatch(login(userData));
      console.log("Profile data:", data);
      showToast("Profile updated successfully", "success");
      // navigate("/lesson-plans");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showToast("Something went wrong", "error");
    }
  };

  return (
    <div className="h-full w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md py-4">
        <div className="bg-white border-1 border-border-primary rounded-md w-full p-6">
          <CustomTextField
            label="Business Name"
            placeholder="Type your business name"
            register={register("business_name")}
            errorMessage={errors.business_name}
            // value={data.business_name} // Assuming you have a state for business name
            className="my-2"
          />

          <CustomTextField
            label="Email Address"
            placeholder="Type your email address"
            type="email"
            register={register("username")}
            errorMessage={errors.username}
            // value={data.email} // Assuming you have a state for email
            className="my-2"
          />

          <CustomTextField
            label="Phone"
            placeholder="Type your phone number"
            register={register("phone")}
            errorMessage={errors.phone}
            // value={data.email} // Assuming you have a state for phone
            className="my-2"
          />

          <CustomTextField
            label="Change Password"
            placeholder="•••••••••"
            type="password"
            register={register("new_password")}
            errorMessage={errors.new_password}
            checkPassword
            className="my-2"
          />

          <Button
            className="mt-2 w-full"
            type="submit"
            variant={"default"}
            size={"default"}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessSettings;
