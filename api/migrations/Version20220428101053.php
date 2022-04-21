<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220428101053 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE category_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE facet_configuration_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE category (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE facet_configuration (id INT NOT NULL, source_field_id INT NOT NULL, category_id INT DEFAULT NULL, display_mode VARCHAR(255) DEFAULT NULL, coverage_rate INT DEFAULT NULL, max_size INT DEFAULT NULL, sort_order VARCHAR(255) DEFAULT NULL, is_recommendable BOOLEAN DEFAULT NULL, is_virtual BOOLEAN DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_108F591B7173162 ON facet_configuration (source_field_id)');
        $this->addSql('CREATE INDEX IDX_108F591B12469DE2 ON facet_configuration (category_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_source_field ON facet_configuration (source_field_id) WHERE (category_id IS NULL)');
        $this->addSql('CREATE UNIQUE INDEX unique_source_field_category ON facet_configuration (source_field_id, category_id) WHERE (category_id IS NOT NULL)');
        $this->addSql('ALTER TABLE facet_configuration ADD CONSTRAINT FK_108F591B7173162 FOREIGN KEY (source_field_id) REFERENCES source_field (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE facet_configuration ADD CONSTRAINT FK_108F591B12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE facet_configuration DROP CONSTRAINT FK_108F591B12469DE2');
        $this->addSql('DROP SEQUENCE category_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE facet_configuration_id_seq CASCADE');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE facet_configuration');
    }
}
