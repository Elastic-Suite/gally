<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220304131959 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE catalog_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE catalog (id INT NOT NULL, code VARCHAR(255) NOT NULL, name VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1B2C324777153098 ON catalog (code)');
        $this->addSql('CREATE TABLE localized_catalog (id INT NOT NULL, catalog_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, code VARCHAR(255) NOT NULL, locale VARCHAR(5) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_DB10491E77153098 ON localized_catalog (code)');
        $this->addSql('CREATE INDEX IDX_DB10491ECC3C66FC ON localized_catalog (catalog_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_code_locale ON localized_catalog (code, locale)');
        $this->addSql('ALTER TABLE localized_catalog ADD CONSTRAINT FK_DB10491ECC3C66FC FOREIGN KEY (catalog_id) REFERENCES catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE localized_catalog DROP CONSTRAINT FK_DB10491ECC3C66FC');
        $this->addSql('DROP SEQUENCE catalog_id_seq CASCADE');
        $this->addSql('DROP TABLE catalog');
        $this->addSql('DROP TABLE localized_catalog');
    }
}
