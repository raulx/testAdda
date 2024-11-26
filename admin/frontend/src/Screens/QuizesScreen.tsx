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
import { HiOutlineDocumentAdd } from "react-icons/hi";

const quizSchema = z.object({
  title: z
    .string()
    .min(2, { message: "title must be of atleast 2 characters." }),
  description: z
    .string()
    .min(2, { message: "description must be of atleast 2 characters." }),
  duration: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().positive("Duration must be a positive number.")
  ),

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
      duration: 0,
      difficulty: "",
    },
  });

  async function handleFormSubmit(values: z.infer<typeof quizSchema>) {
    console.log(values);
    form.reset();
  }

  return (
    <div className="flex flex-col gap-4 bg-[#F6F3F3] m-4 rounded-xl px-4 py-8">
      <div className="max-w-fit mx-auto">Add New Quiz</div>
      <div className="flex gap-2">
        <div className="w-1/2 mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-8 bg-[#E6F3F3]  p-8 border rounded-xl"
            >
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
              <div className="mt-4">
                <FormField
                  name="access_type"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        <FormLabel>Select Access Type : </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <div className="flex gap-4  items-center ">
                              <FormItem>
                                <div className="flex gap-2 items-center">
                                  <FormLabel>Free</FormLabel>
                                  <FormControl>
                                    <RadioGroupItem value="free" />
                                  </FormControl>
                                </div>
                              </FormItem>
                              <FormItem>
                                <div className="flex gap-2 items-center">
                                  <FormLabel>Paid</FormLabel>
                                  <FormControl>
                                    <RadioGroupItem value="paid" />
                                  </FormControl>
                                </div>
                              </FormItem>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button className="bg-lightseagreen font-bold hover:bg-lightseagreen">
                <HiOutlineDocumentAdd />
                Add Quiz
              </Button>
            </form>
          </Form>
        </div>
        <div className="w-1/2  flex flex-col p-4 justify-between gap-4">
          <div className=" h-[400px] border bg-white w-full rounded-lg py-2">
            <div className="p-2 max-w-fit mx-auto">Questions Selected</div>
            <div className="text-sm   max-w-fit ml-auto mr-8">
              Total Selected : 4
            </div>
            <div className="p-4 flex flex-col gap-2 h-[320px] overflow-x-hidden overflow-y-scroll">
              <div className="flex gap-4 bg-lightseagreen text-white justify-evenly rounded">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>
              <div className="flex gap-4 justify-evenly rounded border border-gray-400">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>
              <div className="flex gap-4 justify-evenly rounded border border-gray-400">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>{" "}
              <div className="flex gap-4 justify-evenly rounded border border-gray-400">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>{" "}
              <div className="flex gap-4 justify-evenly rounded border border-gray-400">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>{" "}
              <div className="flex gap-4 justify-evenly rounded border border-gray-400">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>{" "}
              <div className="flex gap-4 justify-evenly rounded border border-gray-400">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>{" "}
              <div className="flex gap-4 justify-evenly rounded border border-gray-400">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>{" "}
              <div className="flex gap-4 justify-evenly rounded border border-gray-400">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>{" "}
              <div className="flex gap-4 justify-evenly rounded border border-gray-400">
                <div>S.No</div>
                <div>Exam</div>
                <div>Difficulty</div>
                <div>Subject</div>
                <div>Topic</div>
                <div>Remove</div>
              </div>
            </div>
          </div>
          <div className="border h-[500px] w-full bg-white rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreenMain;
export { AddNewQuizScreen };
