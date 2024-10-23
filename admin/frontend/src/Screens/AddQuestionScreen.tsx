import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { HiOutlineDocumentAdd } from "react-icons/hi";

import { useAddQuestionMutation } from "@/store/store";
import { Loader1 } from "@/components/Loaders";
import { useToast } from "@/hooks/use-toast";
import { isFetchBaseQueryError } from "@/utils/helpers";
import ApiResponseType from "@/utils/types";

const questionSchema = z.object({
  question: z.string().min(2, {
    message: "question must be at least 2 characters.",
  }),
  options: z.object({
    a: z.string().min(2, { message: "Option is required" }),
    b: z.string().min(2, { message: "Option is required" }),
    c: z.string().min(2, { message: "Option is required" }),
    d: z.string().min(2, { message: "Option is required" }),
  }),
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters",
  }),
  difficulty: z.string().min(2, { message: "Select a  Difficulty" }),
  correct_option: z.string().min(1, { message: "Select Correct Option" }),
  subject: z.string().min(2, { message: "Select Subject" }),
  explaination: z.string().min(2, {
    message: "explaination must be at least 3 characters",
  }),
});

const AddQuestionScreen = () => {
  const [addQuestion, { isLoading }] = useAddQuestionMutation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      options: { a: "", b: "", c: "", d: "" },
      topic: "",
      subject: "",
      difficulty: "",
      correct_option: "",
      explaination: "",
    },
  });

  async function handleFormSubmit(values: z.infer<typeof questionSchema>) {
    try {
      const res = await addQuestion(values);
      if (res.data) {
        return toast({
          title: "Sucessfully added",
          description: res.data?.data.message,
        });
      }
      if (res.error && isFetchBaseQueryError(res.error)) {
        const serverError = res.error.data as ApiResponseType<object>;
        return toast({
          title: "Error",
          description: serverError.message,
          variant: "destructive",
        });
      } else {
        return toast({
          title: "Error Adding Test",
          description: "err",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
    console.log(values);
  }

  return (
    <div className="h-full w-full flex p-4 gap-3">
      <div className="bg-white rounded shadow-custom-2 flex flex-col gap-4 p-4 w-1/2">
        <h1 className="text-center">Add New Question</h1>
        <div className=" bg-gray-50 px-4 py-6 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className=" flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <FormLabel>Options</FormLabel>
                <div className="flex gap-4 flex-wrap">
                  <FormField
                    control={form.control}
                    name="options.a"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <Input {...field} placeholder="Option A" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="options.b"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <Input {...field} placeholder="Option B" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="options.c"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <Input {...field} placeholder="Option C" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="options.d"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <Input {...field} placeholder="Option D" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="correct_option"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Option</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Correct Option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="a">A</SelectItem>
                        <SelectItem value="b">B</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                        <SelectItem value="d">D</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="reasoning">Reasoning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="explaination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explaination</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Explaination..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="bg-lightseagreen font-bold hover:bg-lightseagreen">
                {isLoading ? (
                  <Loader1 className="loader h-4 w-4" />
                ) : (
                  <>
                    <HiOutlineDocumentAdd />
                    Add
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="border rounded border-gray-300 w-1/2">Form 2</div>
    </div>
  );
};

export default AddQuestionScreen;
