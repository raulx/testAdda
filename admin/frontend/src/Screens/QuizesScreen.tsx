import { Link, Outlet, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";

const quizSchema = z.object({
  title: z
    .string()
    .min(2, { message: "title must be of atleast 2 characters." }),
  description: z
    .string()
    .min(2, { message: "description must be of atleast 2 characters." }),
  duration: z
    .string()
    .min(2, { message: "duration must be atleast of 60 seconds" }),
  difficulty: z.string().min(2, { message: "difficulty must be selected" }),
  access_type: z.enum(["free", "paid"], {
    required_error: "You need to select an access type",
  }),
});

const QuizScreenMain = () => {
  const location = useLocation().pathname;

  return (
    <div>
      <div className="flex gap-4 max-w-fit bg-white mx-auto justify-center items-center border-2 py-2 px-4 text-sm rounded-lg mt-2">
        <div className={`${location === "/quizes" && "border-b-2"}`}>
          <Link to={"/quizes"}>Quizes</Link>
        </div>
        <div className={`${location === "/quizes/add/new" && "border-b-2"}`}>
          <Link to={"/quizes/add/new"}>Add New Quizes</Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

const AddNewQuizScreen = () => {
  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "60",
      difficulty: "",
    },
  });

  async function handleFormSubmit(values: z.infer<typeof quizSchema>) {
    console.log("hello world");
    console.log(values);
  }

  return (
    <div className="flex flex-col bg-[#F6F3F3] m-4 rounded-xl py-2 px-4">
      <div className="max-w-fit mx-auto">Add New Quiz</div>
      <div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Quiz Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter description Here"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter duration in seconds"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="access_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Access Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem>
                          <FormLabel>Free</FormLabel>
                          <FormControl>
                            <RadioGroupItem value="free" />
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormLabel>Paid</FormLabel>
                          <FormControl>
                            <RadioGroupItem value="paid" />
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button>Add Quiz</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default QuizScreenMain;
export { AddNewQuizScreen };
