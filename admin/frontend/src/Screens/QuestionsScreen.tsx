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
import {
  AllQuestion,
  useAddQuestionMutation,
  useLazyGetAllQuestionQuery,
  useLazyQuestionSearchQuery,
  useRemoveQuestionMutation,
} from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { formatDate, isFetchBaseQueryError } from "@/utils/helpers";
import ApiResponseType from "@/utils/types";
import { Label } from "@/components/ui/label";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaArrowDown, FaSpinner, FaTrash } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";
import { FaRegFaceDizzy } from "react-icons/fa6";
import { UseAppDispatch } from "@/hooks/useAppDispatch";

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
  question_figure: z.any(),

  difficulty: z.string().min(2, { message: "Select a  Difficulty" }),
  exam: z.string().min(2, { message: "Enter exam that question appeared for" }),
  correct_option: z.string().min(1, { message: "Select Correct Option" }),
  subject: z.string().min(2, { message: "Enter Subject" }),
  explaination: z.string().min(2, {
    message: "explaination must be at least 3 characters",
  }),
});

const DeleteButton = ({
  _id,
  setQuestionNumber,
  setQuestions,
}: {
  _id: string;
  setQuestionNumber: React.Dispatch<SetStateAction<number>>;
  setQuestions: React.Dispatch<SetStateAction<AllQuestion>>;
}) => {
  const { toast } = useToast();
  const [removeQuestion, { isLoading: isDeleting }] =
    useRemoveQuestionMutation();

  const handleDeleteQuestion = async () => {
    try {
      const res = await removeQuestion({ _id });
      if (res.data) {
        // remove question from state
        setQuestions((prevValue) => {
          return [...prevValue].filter((q) => q._id != _id);
        });
        setQuestionNumber((prevValue) => {
          if (prevValue === 0) return 0;
          else return (prevValue -= 1);
        });
        return;
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
          title: "Error Deleting Question",
          description: "Client Error !",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button onClick={handleDeleteQuestion} disabled={isDeleting}>
      {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
    </button>
  );
};

const QuestionsDisplay = () => {
  const [getAllQuestions, { isFetching: fetchingAllQuestions }] =
    useLazyGetAllQuestionQuery();

  const [value, setValue] = useState("");

  const { toast } = useToast();

  const dispatch = UseAppDispatch();

  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [questions, setQuestions] = useState<AllQuestion>([
    {
      avg_solving_time: "",
      correct_option: "",
      createdAt: "",
      difficulty: "",
      explaination: "",
      options: { a: "", b: "", c: "", d: "" },
      question: "",
      subject: "",
      topic: "",
      quiz_id: "",
      exam: "",
      updatedAt: "",
      _id: "",
      __v: 0,
    },
  ]);

  const [questionSearch, { isFetching: isQuestionSearching }] =
    useLazyQuestionSearchQuery();

  const noQuestion = questions[0]?.question === "" || questions?.length === 0;

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const res = await questionSearch(e.target.value);
      if (res.data) {
        setQuestions(res.data?.data);
        return;
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
          title: "Error Adding Question",
          description: "Client Error !",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    setPageNumber((prev) => (prev += 1));
  };

  useEffect(() => {
    const fetchAllQuestion = async () => {
      try {
        const res = await getAllQuestions(null);
        if (res.data) {
          setQuestions(res.data?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllQuestion();
  }, [dispatch, getAllQuestions]);

  const data = questions.filter((q) => {
    return q.subject.includes(value.toLowerCase());
  });

  return (
    <>
      {fetchingAllQuestions ? (
        <div className="w-[60%] h-[600px] flex justify-center items-center">
          <ImSpinner9 className="animate-spin text-3xl text-lightseagreen" />
        </div>
      ) : (
        <div className="w-[60%] flex flex-col gap-4">
          {noQuestion ? (
            <div className="p-6 flex justify-center items-center border-gray-300 shadow-custom-2 min-h-56 rounded-xl border bg-white">
              <div className="flex flex-col gap-2 justify-center items-center text-gray-400">
                <FaRegFaceDizzy className="text-3xl font-semibold" />
                <span className="font-semibold border-b-2 text-gray-400">
                  Not Found !
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-sm border min-h-56 rounded-xl shadow-custom-2 border-gray-300 flex flex-col gap-4 bg-white">
              <h1>Q) {questions[questionNumber]?.question}</h1>
              <div className="flex gap-4 ">
                <div>a) {questions[questionNumber]?.options.a}</div>
                <div>b) {questions[questionNumber]?.options.b}</div>
              </div>
              <div className="flex gap-4">
                <div>c) {questions[questionNumber]?.options.c}</div>
                <div>d) {questions[questionNumber]?.options.d}</div>
              </div>
            </div>
          )}

          <div className="p-6 text-sm border rounded-xl border-gray-300 bg-white shadow-custom-2">
            <div className="flex gap-4">
              <div className="grow flex flex-col gap-2">
                <Label htmlFor="question-input">Search By Question</Label>
                <div className="flex gap-2 grow">
                  <Input
                    id="question-input"
                    placeholder="Enter Question"
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="min-w-48 flex flex-col gap-2">
                <Label htmlFor="subject-input">Search By Subject</Label>
                <Input
                  id="subject-input"
                  placeholder="Search By Subject"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>
            <hr className="h-[2px] bg-gray-300 my-4" />
            {isQuestionSearching ? (
              <div className="h-[600px] flex justify-center items-center">
                <ImSpinner9 className="text-lightseagreen text-3xl animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className=" self-end mr-4 font-semibold text-darkcerulean">
                  Total : {data.length}
                </span>
                <div className="max-h-[600px] overflow-y-scroll overflow-x-hidden scrollbar-thin">
                  <Table className="text-xs">
                    <TableCaption
                      onClick={handleClick}
                      className="cursor-pointer"
                    >
                      {noQuestion ? (
                        <>No Question Found</>
                      ) : (
                        <div className="flex flex-col gap-1 transition-all duration-200 w-1/4 items-center justify-center">
                          Load More <FaArrowDown />
                        </div>
                      )}
                    </TableCaption>
                    <TableHeader>
                      <TableRow className="bg-lightseagreen hover:bg-lightseagreen">
                        <TableHead className="text-white">Added On</TableHead>
                        {/* <TableHead className="text-white">Quiz Id</TableHead> */}
                        <TableHead className="text-white">Exam</TableHead>
                        <TableHead className="text-white">Difficulty</TableHead>
                        <TableHead className="text-white">Subject</TableHead>
                        <TableHead className="text-white">Topic</TableHead>
                        <TableHead className="text-white">Delete</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {!noQuestion &&
                        data?.slice(0, 10 * pageNumber).map((d, index) => {
                          return (
                            <TableRow
                              key={d?._id}
                              onClick={() => setQuestionNumber(index)}
                              className={`cursor-pointer  my-2 ${
                                questionNumber === index && "bg-gray-100"
                              }`}
                            >
                              <TableCell>{formatDate(d?.createdAt)}</TableCell>
                              <TableCell className="capitalize">
                                {d?.exam}
                              </TableCell>
                              <TableCell className="capitalize">
                                {d?.difficulty}
                              </TableCell>
                              <TableCell className=" capitalize">
                                {d?.subject}
                              </TableCell>
                              <TableCell className="capitalize">
                                {d?.topic}
                              </TableCell>
                              <TableCell>
                                <DeleteButton
                                  _id={d?._id}
                                  setQuestionNumber={setQuestionNumber}
                                  setQuestions={setQuestions}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const QuestionScreenMain = () => {
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
      exam: "",
      correct_option: "",
      explaination: "",
    },
  });

  async function handleFormSubmit(values: z.infer<typeof questionSchema>) {
    try {
      const res = await addQuestion(values);
      if (res.data) {
        form.reset();
        window.location.reload();

        return toast({ title: "Question Added Successfully" });
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
          title: "Error Adding Question",
          description: "Client Error !",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-full w-full flex p-4 gap-3">
      <div className="bg-white rounded shadow-custom-2 flex flex-col gap-4 p-4 w-[40%] max-h-fit">
        <h1 className="text-center">Add New Question</h1>
        <div className="bg-gray-50 px-4 py-6 ">
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
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Question Text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question_figure"
                render={() => (
                  <FormItem>
                    <FormLabel>Choose Question Figure, if any</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select Question figure,if any"
                        {...form.register("question_figure")}
                        type="file"
                      />
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
                      <Input {...field} placeholder="Enter Topic" />
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
                    <FormControl>
                      <Input {...field} placeholder="Enter Subject" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Exam" />
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
                      <Textarea placeholder="Enter Explaination" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="bg-lightseagreen font-bold hover:bg-lightseagreen">
                {isLoading ? (
                  <span className="loader h-4 w-4"></span>
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
      <QuestionsDisplay />
    </div>
  );
};

export default QuestionScreenMain;
