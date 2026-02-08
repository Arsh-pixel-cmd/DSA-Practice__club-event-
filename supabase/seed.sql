-- Seed Initial Questions
INSERT INTO public.questions (title, difficulty, description, examples, input_format, output_format, constraints)
VALUES 
(
  'Two Sum', 
  'Easy', 
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  '[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}, {"input": "nums = [3,2,4], target = 6", "output": "[1,2]", "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."}]'::jsonb,
  'First line contains N. Second line contains N integers. Third line contains target.',
  'Print two indices.',
  '2 <= nums.length <= 10^4'
),
(
  'Palindrome Number', 
  'Easy', 
  'Given an integer x, return true if x is a palindrome, and false otherwise.',
  '[{"input": "x = 121", "output": "true", "explanation": "121 reads as 121 from left to right and from right to left."}, {"input": "x = -121", "output": "false", "explanation": "Reads 121- from right to left."}]'::jsonb,
  'An integer x.',
  'true or false.',
  '-2^31 <= x <= 2^31 - 1'
),
(
  'Valid Parentheses', 
  'Medium', 
  'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.',
  '[{"input": "s = ''()''", "output": "true"}, {"input": "s = ''()[]{}''", "output": "true"}, {"input": "s = ''(]''", "output": "false"}]'::jsonb,
  'A string s.',
  'true or false.',
  '1 <= s.length <= 10^4'
)
ON CONFLICT DO NOTHING;
