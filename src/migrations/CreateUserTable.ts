import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable implements MigrationInterface {
  name = 'CreateUserTable';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`user\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(30) NOT NULL,
        \`email\` VARCHAR(60) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`gender\` ENUM('male', 'female', 'other') NOT NULL,
        \`birthdate\` DATE NOT NULL,
        \`usertype\` ENUM('customer', 'store_owner') NOT NULL,
        \`signupVerifyToken\` VARCHAR(100) NOT NULL,
        \`isVerified\` BOOLEAN NOT NULL DEFAULT false,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
