<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250811160217 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create or drop the ifpen_user_data table.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE ifpen_user_data_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE ifpen_user_data (id INT NOT NULL, user_id INT NOT NULL, department VARCHAR(255) NOT NULL, is_director BOOLEAN NOT NULL, is_permanent BOOLEAN NOT NULL, groups JSON DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_E6433997A76ED395 ON ifpen_user_data (user_id)');
        $this->addSql('ALTER TABLE ifpen_user_data ADD CONSTRAINT FK_E6433997A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP SEQUENCE ifpen_user_data_id_seq CASCADE');
        $this->addSql('ALTER TABLE ifpen_user_data DROP CONSTRAINT FK_E6433997A76ED395');
        $this->addSql('DROP TABLE ifpen_user_data');
    }
}
