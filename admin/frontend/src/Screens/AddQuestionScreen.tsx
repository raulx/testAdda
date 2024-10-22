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

const questionSchema = z.object({
  question: z.string().min(2, {
    message: "question must be at least 2 characters.",
  }),
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters",
  }),
  difficulty: z.string().min(2, { message: "Select a value" }),
  explaination: z.string().min(2, {
    message: "explaination must be at least 3 characters",
  }),
});

const AddQuestionScreen = () => {
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      topic: "",
      difficulty: "",
      explaination: "",
    },
  });

  function handleFormSubmit(values: z.infer<typeof questionSchema>) {
    console.log(values);
  }

  return (
    <div className="h-full w-full flex p-4 gap-3">
      <div className="bg-white rounded grow shadow-custom-2 flex flex-col gap-4 p-4">
        <h1 className="text-center">Add New Question</h1>
        <div className=" bg-gray-50 px-4 py-6 grow">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="h-full w-full flex flex-col justify-between"
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
                          <SelectValue placeholder="select value" />
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
              <Button className="bg-lightseagreen font-bold">
                <HiOutlineDocumentAdd />
                Add
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="border rounded grow border-gray-300">Form 2</div>
    </div>
  );
};

export default AddQuestionScreen;
