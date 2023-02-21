import { validateOrReject } from "class-validator";
import { BaseEntity, BeforeInsert, BeforeUpdate } from "typeorm";

export abstract class ValidationEntity extends BaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async validate(): Promise<void> {
    await validateOrReject(this);
  }
  //abstract class로 정의하여 ValidationEntity를 직접 생성할 수 없도록 하였다.
  // ValidationEntity는 BaseEntity를 상속받는다.

  // @BeforeInsert, @BeforeUpdate decorator로 DB에 반영되기전에 validate 메서드를 실행하도록 지정하였다.

  // validateOrReject 함수는, 대상 엔티티를 검증하여, 올바른 값이 아닐 시에 에러를 발생시키는 함수다. 객체 자신을 인자로 넘겨 검증하도록 하였다.

  // DB에 저장 전 검증이 필요한 엔티티 클래스는 이 클래스를 상속하여 검증이 가능하다.
}
