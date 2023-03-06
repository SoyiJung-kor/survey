import { CreateResponseCategoryInput } from './create-response-category.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateResponseCategoryInput extends PartialType(
  CreateResponseCategoryInput,
) { }
